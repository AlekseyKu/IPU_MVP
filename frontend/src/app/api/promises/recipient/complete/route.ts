import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function PUT(request: NextRequest) {
  try {
    const { promise_id, user_id, result_content, result_media_url } = await request.json();
    if (!promise_id || !user_id) {
      return NextResponse.json({ detail: 'Missing promise_id or user_id' }, { status: 400 });
    }
    // Получаем обещание
    const { data: promise, error } = await supabase
      .from('promises')
      .select('user_id, is_completed_by_creator')
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
    return NextResponse.json({ message: 'Promise completed by creator' }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ detail: 'Server error' }, { status: 500 });
  }
} 