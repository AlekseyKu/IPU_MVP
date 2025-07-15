// frontend/src/app/api/challenges/route.ts
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Received body:', body); // Лог входных данных
    const {
      user_id,
      title,
      frequency,
      total_reports,
      content,
      media_url,
    } = body;

    if (!user_id || !title || !frequency || !total_reports) {
      return NextResponse.json({ detail: 'Missing required fields' }, { status: 400 });
    }

    if (!['daily', 'weekly', 'monthly'].includes(frequency)) {
      return NextResponse.json({ detail: 'Invalid frequency value' }, { status: 400 });
    }

    if (total_reports < 1) {
      return NextResponse.json({ detail: 'Total reports must be at least 1' }, { status: 400 });
    }

    const { error } = await supabase.from('challenges').insert({
      user_id: Number(user_id),
      title,
      frequency,
      total_reports: Number(total_reports),
      content,
      media_url,
      created_at: new Date().toISOString(),
      is_public: true,
      is_completed: false, // Добавлено с начальным значением
    });

    if (error) {
      console.error('Database error:', error); // Лог ошибки
      return NextResponse.json({ detail: `Database error: ${error.message}` }, { status: 400 });
    }

    console.log('Challenge created successfully');
    return NextResponse.json({ message: 'Challenge created successfully' }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Server error:', message); // Лог серверной ошибки
    return NextResponse.json({ detail: `Server error: ${message}` }, { status: 500 });
  }
}