import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function PUT(request: NextRequest) {
  try {
    const { promise_id, user_id } = await request.json();
    if (!promise_id || !user_id) {
      return NextResponse.json({ detail: 'Missing promise_id or user_id' }, { status: 400 });
    }
    // Получаем обещание
    const { data: promise, error } = await supabase
      .from('promises')
      .select('recipient_id, is_accepted')
      .eq('id', promise_id)
      .single();
    if (error || !promise) {
      return NextResponse.json({ detail: 'Promise not found' }, { status: 404 });
    }
    if (promise.recipient_id !== user_id) {
      return NextResponse.json({ detail: 'Not allowed' }, { status: 403 });
    }
    if (promise.is_accepted === false) {
      return NextResponse.json({ detail: 'Already declined' }, { status: 400 });
    }
    // Обновляем статус
    const { error: updateError } = await supabase
      .from('promises')
      .update({ is_accepted: false })
      .eq('id', promise_id);
    if (updateError) {
      return NextResponse.json({ detail: 'Update failed' }, { status: 500 });
    }
    return NextResponse.json({ message: 'Promise declined' }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ detail: 'Server error' }, { status: 500 });
  }
} 