// frontend/src/app/api/challenges/route.ts
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      user_id,
      title,
      frequency,
      total_reports,
      deadline,
      content,
      media_url,
    } = body;

    if (!user_id || !title || !frequency || !total_reports || !deadline) {
      return NextResponse.json({ detail: 'Missing required fields' }, { status: 400 });
    }

    if (!['daily', 'weekly', 'monthly'].includes(frequency)) {
      return NextResponse.json({ detail: 'Invalid frequency value' }, { status: 400 });
    }

    if (total_reports < 1) {
      return NextResponse.json({ detail: 'Total reports must be at least 1' }, { status: 400 });
    }

    const now = new Date();
    if (new Date(deadline) <= now) {
      return NextResponse.json({ detail: 'Deadline must be in the future' }, { status: 400 });
    }

    const { error } = await supabase.from('challenges').insert({
      user_id: Number(user_id),
      title,
      frequency,
      total_reports: Number(total_reports),
      deadline,
      content,
      media_url,
      created_at: new Date().toISOString(),
      is_public: true,
    });

    if (error) {
      return NextResponse.json({ detail: `Database error: ${error.message}` }, { status: 400 });
    }

    return NextResponse.json({ message: 'Challenge created successfully' }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ detail: `Server error: ${message}` }, { status: 500 });
  }
}