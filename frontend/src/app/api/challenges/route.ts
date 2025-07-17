// frontend/src/app/api/challenges/route.ts
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

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
  action: 'start' | 'check_day' | 'finish';
  start_at?: string;
  final_check?: boolean;
}

function generateReportPeriods(start: Date, totalReports: number, interval: number): string[] {
  const periods = [];
  let currentStart = new Date(start);
  for (let i = 0; i < totalReports; i++) {
    const periodEnd = new Date(currentStart);
    periodEnd.setDate(currentStart.getDate() + interval - 1);
    periods.push(`${currentStart.toISOString().split('T')[0]}/${periodEnd.toISOString().split('T')[0]}`);
    currentStart.setDate(currentStart.getDate() + interval);
  }
  return periods;
}

export async function POST(request: Request) {
  try {
    const body: CreateChallengeBody = await request.json();
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

    const { data: existingChallenge } = await supabase
      .from('challenges')
      .select('id')
      .eq('user_id', user_id)
      .eq('title', title)
      .limit(1);
    if (existingChallenge?.length) {
      return NextResponse.json({ detail: 'Challenge with this title already exists' }, { status: 400 });
    }

    const now = new Date('2025-07-17T14:06:00+07:00');
    const frequencyInterval = { daily: 1, weekly: 7, monthly: 30 } as const;
    const interval = frequencyInterval[frequency as keyof typeof frequencyInterval];
    const newReportPeriods = generateReportPeriods(now, total_reports, interval);
    const newDeadlinePeriod = newReportPeriods[newReportPeriods.length - 1];

    const { data, error: insertError } = await supabase.from('challenges').insert({
      user_id,
      title,
      frequency,
      frequency_interval: interval,
      total_reports,
      content,
      media_url,
      created_at: now.toISOString(),
      start_at: now.toISOString(),
      report_periods: newReportPeriods,
      deadline_period: newDeadlinePeriod,
      completed_reports: 0,
      is_public: true,
      is_completed: false,
    }).select().single();

    if (insertError) throw insertError;

    return NextResponse.json({
      message: 'Challenge created successfully',
      id: data.id,
      start_at: now.toISOString(),
      report_periods: newReportPeriods,
      deadline_period: newDeadlinePeriod,
      completed_reports: 0,
    }, { status: 201 });
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

    if (!id) return NextResponse.json({ detail: 'Missing challenge id' }, { status: 400 });

    const { user_id, action, start_at, final_check } = body;
    if (!user_id || !action) return NextResponse.json({ detail: 'Missing user_id or action' }, { status: 400 });

    const challenge = await supabase
      .from('challenges')
      .select('user_id, start_at, report_periods, deadline_period, completed_reports, total_reports, is_completed, frequency')
      .eq('id', id)
      .single();

    if (challenge.error) return NextResponse.json({ detail: 'Challenge not found' }, { status: 404 });
    if (challenge.data.user_id !== user_id) return NextResponse.json({ detail: 'Unauthorized' }, { status: 403 });

    const now = new Date('2025-07-17T14:06:00+07:00');

    if (action === 'start') {
      if (challenge.data.start_at) return NextResponse.json({ detail: 'Challenge already started' }, { status: 400 });
      const frequencyInterval = { daily: 1, weekly: 7, monthly: 30 } as const;
      const interval = frequencyInterval[challenge.data.frequency as keyof typeof frequencyInterval];
      const newReportPeriods = generateReportPeriods(now, challenge.data.total_reports, interval);
      const newDeadlinePeriod = newReportPeriods[newReportPeriods.length - 1];

      const { error: updateError } = await supabase
        .from('challenges')
        .update({
          start_at: start_at || now.toISOString(),
          report_periods: newReportPeriods,
          deadline_period: newDeadlinePeriod,
        })
        .eq('id', id);

      if (updateError) throw updateError;

      return NextResponse.json({
        message: 'Challenge started',
        start_at: start_at || now.toISOString(),
        report_periods: newReportPeriods,
        deadline_period: newDeadlinePeriod,
      }, { status: 200 });
    }

    if (action === 'check_day') {
      const reportPeriods = challenge.data.report_periods || [];
      const currentPeriod = reportPeriods.find((period: string) => {
        const [start, end] = period.split('/');
        return now >= new Date(start) && now <= new Date(end);
      });

      if (!currentPeriod) return NextResponse.json({ detail: 'Not in a valid report period' }, { status: 400 });

      const { data: existingReports } = await supabase
        .from('challenge_reports')
        .select('report_date')
        .eq('challenge_id', id)
        .eq('user_id', user_id)
        .gte('report_date', currentPeriod.split('/')[0])
        .lte('report_date', currentPeriod.split('/')[1]);

      if (existingReports?.length) return NextResponse.json({ detail: 'Report already submitted' }, { status: 400 });

      await supabase.from('challenge_reports').insert({
        user_id,
        challenge_id: id,
        report_date: now.toISOString(),
      });

      const newCompletedReports = challenge.data.completed_reports + 1;
      await supabase
        .from('challenges')
        .update({ completed_reports: newCompletedReports })
        .eq('id', id);

      return NextResponse.json({
        message: 'Check day recorded',
        completed_reports: newCompletedReports,
      }, { status: 200 });
    }

    if (action === 'finish') {
      if (!challenge.data.deadline_period) return NextResponse.json({ detail: 'No deadline period' }, { status: 400 });

      const [start, end] = challenge.data.deadline_period.split('/');
      if (!start || !end) return NextResponse.json({ detail: 'Invalid deadline period format' }, { status: 400 });

      const startDate = new Date(start);
      const endDate = new Date(end);
      const nowDateOnly = new Date(now.toISOString().split('T')[0]);

      if (nowDateOnly < startDate || nowDateOnly > endDate) {
        return NextResponse.json({ detail: 'Not in deadline period' }, { status: 400 });
      }

      const newCompletedReports = challenge.data.completed_reports + (final_check ? 1 : 0);
      await supabase
        .from('challenges')
        .update({
          completed_reports: newCompletedReports,
          is_completed: true,
        })
        .eq('id', id);

      return NextResponse.json({
        message: 'Challenge completed',
        completed_reports: newCompletedReports,
        is_completed: true,
      }, { status: 200 });
    }

    return NextResponse.json({ detail: 'Invalid action' }, { status: 400 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Server error:', message);
    return NextResponse.json({ detail: `Server error: ${message}` }, { status: 500 });
  }
  // БАЗА
}