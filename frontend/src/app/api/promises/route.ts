// frontend\src\app\api\promises\route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

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
    // Уменьшаем счетчик promises
    await supabase.rpc('decrement_promises', { user_id });
    // Если promise был выполнен, уменьшаем promises_done
    if (is_completed) {
      await supabase.rpc('decrement_promises_done', { user_id });
    }
    return NextResponse.json({ success: true });
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
    const { error } = await supabase
      .from('promises')
      .update(updatedPromise)
      .eq('id', updatedPromise.id);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    // Если promise стал выполненным, увеличиваем promises_done
    if (oldPromise && !oldPromise.is_completed && updatedPromise.is_completed) {
      await supabase.rpc('increment_promises_done', { user_id: oldPromise.user_id });
    }
    // Если promise был выполнен, а теперь нет — уменьшаем
    if (oldPromise && oldPromise.is_completed && !updatedPromise.is_completed) {
      await supabase.rpc('decrement_promises_done', { user_id: oldPromise.user_id });
    }
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

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
      is_public: data.is_public ?? true
    }).select().single();
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    // Увеличиваем счетчик promises
    await supabase.rpc('increment_promises', { user_id: data.user_id });
    return NextResponse.json({ success: true, promise: inserted });
  } catch (e) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
} 