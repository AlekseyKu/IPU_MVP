// TODO: Для обещаний с recipient_id и requires_accept использовать отдельные роуты (accept, decline, complete, confirm-complete) — не смешивать с обычной логикой.
// frontend\src\app\api\promises\route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    // Минимальная валидация
    if (!data.user_id || !data.title || !data.deadline) {
      return NextResponse.json({ error: 'user_id, title и deadline обязательны' }, { status: 400 });
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
    // Убираем RPC вызов - триггер уже обновляет счетчик
    // await supabase.rpc('increment_promises', { user_id: data.user_id });
    return NextResponse.json({ success: true, promise: inserted });
  } catch (e) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const updatedPromise = await request.json();
    
    if (!updatedPromise.id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }
    
    // Получаем старое значение is_completed
    const { data: oldPromise } = await supabase.from('promises').select('is_completed, user_id').eq('id', updatedPromise.id).single();

    // Формируем объект для обновления, поддерживая новые поля
    const updateFields: any = { ...updatedPromise };
    // Только разрешённые поля
    const allowed = ['title','content','media_url','deadline','is_public','is_completed','result_content','result_media_url','completed_at','hashtags','requires_accept','recipient_id','is_accepted','is_completed_by_creator','is_completed_by_recipient'];
    Object.keys(updateFields).forEach(key => { if (!allowed.includes(key)) delete updateFields[key]; });

    const { error, data: updatedRows } = await supabase
      .from('promises')
      .update(updateFields)
      .eq('id', updatedPromise.id)
      .select();
      
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    // Убираем RPC вызовы - триггеры уже обновляют счетчики
    // if (oldPromise && !oldPromise.is_completed && updatedPromise.is_completed) {
    //   await supabase.rpc('increment_promises_done', { user_id: oldPromise.user_id });
    // }
    // if (oldPromise && oldPromise.is_completed && !updatedPromise.is_completed) {
    //   await supabase.rpc('decrement_promises_done', { user_id: oldPromise.user_id });
    // }
    
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
    // Убираем RPC вызовы - триггеры уже обновляют счетчики
    // await supabase.rpc('decrement_promises', { user_id });
    // if (is_completed) {
    //   await supabase.rpc('decrement_promises_done', { user_id });
    // }
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}