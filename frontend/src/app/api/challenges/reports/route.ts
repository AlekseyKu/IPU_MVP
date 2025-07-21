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