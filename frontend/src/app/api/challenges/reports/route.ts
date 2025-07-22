// frontend\src\app\api\challenges\reports\route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function POST(request: NextRequest) {
  try {
    const { challenge_id, user_id, comment, media_url } = await request.json();

    if (!challenge_id || !user_id || !comment) {
      return NextResponse.json({ error: 'challenge_id, user_id и comment обязательны' }, { status: 400 });
    }

    // Вставляем отчет
    const { data, error } = await supabase.from('challenge_reports').insert({
      challenge_id,
      user_id,
      comment,
      media_url: media_url || null,
      report_date: new Date().toISOString(),
    }).select().single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, report: data });
  } catch (e) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const challenge_id = searchParams.get('challenge_id');
  const user_id = searchParams.get('user_id');

  if (!challenge_id || !user_id) {
    return NextResponse.json([], { status: 200 }); // Возвращаем пустой массив, если нет параметров
  }

  const { data, error } = await supabase
    .from('challenge_reports')
    .select('report_date')
    .eq('challenge_id', challenge_id)
    .eq('user_id', user_id)
    .order('report_date', { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data || [], { status: 200 });
} 