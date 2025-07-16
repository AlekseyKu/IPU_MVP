// frontend/src/app/api/challenges/route.ts
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

// Интерфейс для входных данных
interface CreateChallengeBody {
  user_id: number;
  title: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  total_reports: number;
  content?: string;
  media_url?: string;
}

interface ActionBody {
  user_id: number;
  action: 'check_day' | 'finish';
  final_check?: boolean;
}

export async function POST(request: Request) {
  try {
    const body: CreateChallengeBody = await request.json();
    console.log('Received body:', body);
    const { user_id, title, frequency, total_reports, content, media_url } = body;

    if (!user_id || !title || !frequency || !total_reports) {
      return NextResponse.json({ detail: 'Missing required fields' }, { status: 400 });
    }

    if (!['daily', 'weekly', 'monthly'].includes(frequency)) {
      return NextResponse.json({ detail: 'Invalid frequency value' }, { status: 400 });
    }

    if (total_reports < 1) {
      return NextResponse.json({ detail: 'Total reports must be at least 1' }, { status: 400 });
    }

    const frequencyInterval = {
      daily: 1,
      weekly: 7,
      monthly: 30,
    } as const;

    const { error } = await supabase.from('challenges').insert({
      user_id: Number(user_id),
      title,
      frequency,
      frequency_interval: frequencyInterval[frequency],
      total_reports: Number(total_reports),
      content,
      media_url,
      created_at: new Date().toISOString(),
      is_public: true,
      is_completed: false,
    });

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json({ detail: `Database error: ${error.message}` }, { status: 400 });
    }

    console.log('Challenge created successfully');
    return NextResponse.json({ message: 'Challenge created successfully' }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Server error:', message);
    return NextResponse.json({ detail: `Server error: ${message}` }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const body: ActionBody = await request.json();
    console.log('Received body for action:', body);

    if (!id) {
      return NextResponse.json({ detail: 'Missing challenge id' }, { status: 400 });
    }

    const { user_id, action, final_check } = body;
    if (!user_id || !action) {
      return NextResponse.json({ detail: 'Missing user_id or action' }, { status: 400 });
    }

    const challenge = await supabase
      .from('challenges')
      .select('user_id, start_at, report_periods, deadline_period, completed_reports, total_reports, is_completed')
      .eq('id', id)
      .single();

    if (challenge.error) {
      return NextResponse.json({ detail: 'Challenge not found' }, { status: 404 });
    }

    if (challenge.data.user_id !== Number(user_id)) {
      return NextResponse.json({ detail: 'Unauthorized' }, { status: 403 });
    }

    const now = new Date('2025-07-16T23:08:00+07:00');
    const reportPeriods = challenge.data.report_periods as string[] || [];
    const deadlinePeriod = challenge.data.deadline_period as string;

    console.log('Debug - challenge data:', { reportPeriods, deadlinePeriod, now });

    if (action === 'check_day') {
      const currentPeriod = reportPeriods.find((period: string) => {
        const [start, end] = period.split('/');
        const startDate = new Date(start);
        const endDate = new Date(end);
        return now >= startDate && now <= endDate;
      });

      if (!currentPeriod) {
        return NextResponse.json({ detail: 'Not in a valid report period' }, { status: 400 });
      }

      const { data: existingReports } = await supabase
        .from('challenge_reports')
        .select('report_date')
        .eq('challenge_id', id)
        .eq('user_id', user_id)
        .gte('report_date', currentPeriod.split('/')[0])
        .lte('report_date', currentPeriod.split('/')[1]);

      if (existingReports?.length) {
        return NextResponse.json({ detail: 'Report already submitted for this period' }, { status: 400 });
      }

      const { error: reportError } = await supabase.from('challenge_reports').insert({
        user_id: Number(user_id),
        challenge_id: id,
        report_date: now.toISOString(),
      });

      if (reportError) {
        return NextResponse.json({ detail: `Database error: ${reportError.message}` }, { status: 400 });
      }

      const { error: updateError } = await supabase
        .from('challenges')
        .update({ completed_reports: challenge.data.completed_reports + 1 })
        .eq('id', id);

      if (updateError) {
        return NextResponse.json({ detail: `Database error: ${updateError.message}` }, { status: 400 });
      }

      return NextResponse.json({ message: 'Check day recorded' }, { status: 200 });
    }

    if (action === 'finish') {
      if (!deadlinePeriod) {
        return NextResponse.json({ detail: 'No deadline period set' }, { status: 400 });
      }

      const [start, end] = deadlinePeriod.split('/');
      if (!start || !end) {
        return NextResponse.json({ detail: 'Invalid deadline period format' }, { status: 400 });
      }

      const startDate = new Date(start);
      const endDate = new Date(end);
      const nowDateOnly = new Date(now.toISOString().split('T')[0]);

      console.log('Debug - finish check:', { startDate, endDate, nowDateOnly, deadlinePeriod });

      if (nowDateOnly < startDate || nowDateOnly > endDate) {
        return NextResponse.json({ detail: 'Not in deadline period' }, { status: 400 });
      }

      const { error } = await supabase
        .from('challenges')
        .update({
          completed_reports: challenge.data.completed_reports + (final_check ? 1 : 0),
          is_completed: true,
        })
        .eq('id', id);

      if (error) {
        return NextResponse.json({ detail: `Database error: ${error.message}` }, { status: 400 });
      }

      return NextResponse.json({ message: 'Challenge completed' }, { status: 200 });
    }

    return NextResponse.json({ detail: 'Invalid action' }, { status: 400 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Server error:', message);
    return NextResponse.json({ detail: `Server error: ${message}` }, { status: 500 });
  }
}