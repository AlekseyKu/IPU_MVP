// TODO: Для обещаний с recipient_id и requires_accept использовать отдельные роуты (accept, decline, complete, confirm-complete) — не смешивать с обычной логикой.
// frontend\src\app\api\promises\route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import { checkActivePromisesLimit, awardKarma } from '@/utils/karmaService';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    // Минимальная валидация
    if (!data.user_id || !data.title || !data.deadline) {
      return NextResponse.json({ error: 'user_id, title и deadline обязательны' }, { status: 400 });
    }

    // Проверяем лимит активных обещаний
    const canCreate = await checkActivePromisesLimit(data.user_id);
    if (!canCreate) {
      return NextResponse.json({ 
        error: 'Превышен лимит активных обещаний (максимум 5)' 
      }, { status: 400 });
    }

    const { error, data: inserted } = await supabase.from('promises').insert({
      user_id: data.user_id,
      title: data.title,
      deadline: data.deadline,
      content: data.content || '',
      media_url: data.media_url || null,
      created_at: new Date().toISOString(),
      is_completed: false,
      is_public: data.is_public ?? true,
      hashtags: data.hashtags || null,
      // --- Новые поля для обещаний "кому-то" ---
      requires_accept: data.requires_accept || false,
      recipient_id: data.recipient_id || null,
      is_accepted: data.requires_accept ? null : null, // null для обещаний "кому-то"
      is_completed_by_creator: null,
      is_completed_by_recipient: null
    }).select().single();
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Начисляем карму за создание обещания
    try {
      await awardKarma(
        data.user_id, 
        1, 
        'Создание обещания', 
        'promise', 
        inserted.id
      );
    } catch (karmaError) {
      console.error('Error awarding karma for promise creation:', karmaError);
      // Не прерываем создание обещания, если карма не начислилась
    }

    return NextResponse.json({ success: true, promise: inserted });
  } catch (e) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const updatedPromise = await request.json();
    if (!updatedPromise.id) {
      return NextResponse.json({ error: 'ID обязателен' }, { status: 400 });
    }

    // Получаем текущие данные обещания
    const { data: oldPromise, error: selectError } = await supabase
      .from('promises')
      .select('is_completed, user_id, created_at')
      .eq('id', updatedPromise.id)
      .single();
    
    if (selectError || !oldPromise) {
      return NextResponse.json({ error: 'Promise не найден' }, { status: 404 });
    }

    // Проверяем время для завершения обещания
    if (updatedPromise.is_completed && !oldPromise.is_completed) {
      const createdAt = new Date(oldPromise.created_at);
      const now = new Date();
      const hoursDiff = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);
      
      if (hoursDiff < 3) {
        return NextResponse.json({ 
          error: 'Завершение обещания возможно только через 3 часа после создания' 
        }, { status: 403 });
      }
    }

    const allowed = ['title', 'content', 'media_url', 'deadline', 'is_public', 'is_completed', 'result_content', 'result_media_url', 'completed_at', 'hashtags', 'requires_accept', 'recipient_id', 'is_accepted', 'is_completed_by_creator', 'is_completed_by_recipient'];
    const updateFields: any = { ...updatedPromise };
    Object.keys(updateFields).forEach(key => { if (!allowed.includes(key)) delete updateFields[key]; });

    const { error, data: updatedRows } = await supabase
      .from('promises')
      .update(updateFields)
      .eq('id', updatedPromise.id)
      .select();
      
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    // Начисляем карму при завершении обещания
    if (oldPromise && !oldPromise.is_completed && updatedPromise.is_completed) {
      console.log('🎯 Promise completion detected, awarding karma...');
      try {
        // Получаем полные данные обещания для проверки типа
        const { data: fullPromise } = await supabase
          .from('promises')
          .select('requires_accept, recipient_id, deadline')
          .eq('id', updatedPromise.id)
          .single();

        console.log('📊 Full promise data:', fullPromise);

        if (fullPromise) {
          const isOverdue = new Date(fullPromise.deadline) < new Date();
          console.log('⏰ Deadline check:', { deadline: fullPromise.deadline, isOverdue });
          
          if (!isOverdue) {
            if (fullPromise.requires_accept) {
              // Обещание "кому-то"
              console.log('🎁 Awarding karma for promise to someone');
              await awardKarma(
                oldPromise.user_id, 
                3, 
                'Выполнение обещания для другого', 
                'promise', 
                updatedPromise.id
              );
              if (fullPromise.recipient_id) {
                await awardKarma(
                  fullPromise.recipient_id, 
                  1, 
                  'Получение выполненного обещания', 
                  'promise', 
                  updatedPromise.id
                );
              }
            } else {
              // Обещание себе
              console.log('🎁 Awarding karma for self promise');
              await awardKarma(
                oldPromise.user_id, 
                2, 
                'Выполнение своего обещания', 
                'promise', 
                updatedPromise.id
              );
            }
          } else {
            console.log('⏰ Promise completed but overdue - no karma awarded');
          }
        }
      } catch (karmaError) {
        console.error('❌ Error awarding karma for promise completion:', karmaError);
        // Не прерываем завершение обещания, если карма не начислилась
      }
    }
    
    return NextResponse.json({ success: true, promise: updatedRows?.[0] });
  } catch (e) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ error: 'ID обязателен' }, { status: 400 });
    }
    // Получаем user_id и is_completed по id
    const { data: promiseData, error: selectError } = await supabase
      .from('promises')
      .select('user_id, is_completed')
      .eq('id', id)
      .single();
    if (selectError || !promiseData) {
      return NextResponse.json({ error: 'Promise не найден' }, { status: 404 });
    }
    const { user_id, is_completed } = promiseData;
    
    // Удаляем обещание
    const { error } = await supabase.from('promises').delete().eq('id', id);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Списываем карму за удаление обещания
    try {
      await awardKarma(
        user_id, 
        -1, 
        'Удаление обещания', 
        'promise', 
        id
      );
    } catch (karmaError) {
      console.error('Error deducting karma for promise deletion:', karmaError);
      // Не прерываем удаление обещания, если карма не списалась
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}