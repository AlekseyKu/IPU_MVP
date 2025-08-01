import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import { awardKarma, isPromiseOverdue } from '@/utils/karmaService';

export async function PUT(request: NextRequest) {
  try {
    const { promise_id, user_id, result_content, result_media_url } = await request.json();
    if (!promise_id || !user_id) {
      return NextResponse.json({ detail: 'Missing promise_id or user_id' }, { status: 400 });
    }
    
    // Получаем обещание с дополнительными полями для проверки кармы
    const { data: promise, error } = await supabase
      .from('promises')
      .select('user_id, is_completed_by_creator, requires_accept, recipient_id, deadline')
      .eq('id', promise_id)
      .single();
      
    if (error || !promise) {
      return NextResponse.json({ detail: 'Promise not found' }, { status: 404 });
    }
    if (promise.user_id !== user_id) {
      return NextResponse.json({ detail: 'Not allowed' }, { status: 403 });
    }
    if (promise.is_completed_by_creator === true) {
      return NextResponse.json({ detail: 'Already completed by creator' }, { status: 400 });
    }
    
    // Обновляем статус и сохраняем отчет
    const updateData: any = { is_completed_by_creator: true };
    if (result_content) updateData.result_content = result_content;
    if (result_media_url) updateData.result_media_url = result_media_url;
    
    const { error: updateError } = await supabase
      .from('promises')
      .update(updateData)
      .eq('id', promise_id);
    if (updateError) {
      return NextResponse.json({ detail: 'Update failed' }, { status: 500 });
    }

    // Начисляем карму за выполнение обещания
    try {
      const isOverdue = isPromiseOverdue(promise.deadline);
      
      if (!isOverdue) {
        if (promise.requires_accept) {
          // Обещание "кому-то"
          await awardKarma(
            promise.user_id, 
            3, 
            'Выполнение обещания для другого', 
            'promise', 
            promise_id
          );
          if (promise.recipient_id) {
            await awardKarma(
              promise.recipient_id, 
              1, 
              'Получение выполненного обещания', 
              'promise', 
              promise_id
            );
          }
        } else {
          // Обещание себе
          await awardKarma(
            promise.user_id, 
            2, 
            'Выполнение своего обещания', 
            'promise', 
            promise_id
          );
        }
      } else {
        console.log('Promise completed but overdue - no karma awarded');
      }
    } catch (karmaError) {
      console.error('Error awarding karma for promise completion:', karmaError);
      // Не прерываем выполнение обещания, если карма не начислилась
    }

    return NextResponse.json({ message: 'Promise completed by creator' }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ detail: 'Server error' }, { status: 500 });
  }
} 