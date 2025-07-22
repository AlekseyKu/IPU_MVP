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
  comment?: string;
  media_url?: string;
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

    const now = new Date();
    const frequencyInterval = { daily: 1, weekly: 7, monthly: 30 } as const;
    const interval = frequencyInterval[frequency as keyof typeof frequencyInterval];

    const { data, error: insertError } = await supabase.from('challenges').insert({
      user_id,
      title,
      frequency,
      frequency_interval: interval,
      total_reports,
      content,
      media_url,
      created_at: now.toISOString(),
      completed_reports: 0,
      is_public: true,
      is_completed: false,
    }).select().single();

    if (insertError) throw insertError;

    // Увеличиваем счетчик promises
    await supabase.rpc('increment_promises', { user_id });

    return NextResponse.json({
      message: 'Challenge created successfully',
      id: data.id,
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

    const now = new Date();

    if (action === 'start') {
      if (challenge.data.start_at) return NextResponse.json({ detail: 'Challenge already started' }, { status: 400 });
      const { comment, media_url } = body;
      const frequencyInterval = { daily: 1, weekly: 7, monthly: 30 } as const;
      const interval = frequencyInterval[challenge.data.frequency as keyof typeof frequencyInterval];
      const nowIso = start_at || now.toISOString();
      const newReportPeriods = generateReportPeriods(now, challenge.data.total_reports, interval);
      const newDeadlinePeriod = newReportPeriods[newReportPeriods.length - 1];

      // Создаём первый отчет
      await supabase.from('challenge_reports').insert({
        user_id,
        challenge_id: id,
        comment: comment || '',
        media_url: media_url || null,
        report_date: nowIso,
      });

      const { error: updateError } = await supabase
        .from('challenges')
        .update({
          start_at: nowIso,
          report_periods: newReportPeriods,
          deadline_period: newDeadlinePeriod,
          completed_reports: 1, // Сразу учитываем первый отчет
        })
        .eq('id', id);

      if (updateError) throw updateError;

      // Возвращаем весь объект challenge
      const { data: updatedChallenge, error: selectError } = await supabase
        .from('challenges')
        .select('*')
        .eq('id', id)
        .single();
      if (selectError || !updatedChallenge) {
        return NextResponse.json({ detail: 'Challenge not found after update' }, { status: 500 });
      }
      return NextResponse.json(updatedChallenge, { status: 200 });
    }

    if (action === 'check_day') {
      const { comment, media_url } = body;
      const reportPeriods = challenge.data.report_periods || [];
      const nowDateOnly = now.toISOString().split('T')[0];
      const currentPeriod = reportPeriods.find((period: string) => {
        const [start, end] = period.split('/');
        return nowDateOnly >= start && nowDateOnly <= end;
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

      // Создаем отчет с текстом и медиа
      await supabase.from('challenge_reports').insert({
        user_id,
        challenge_id: id,
        report_date: now.toISOString(),
        comment: comment || '',
        media_url: media_url || null,
      });

      const newCompletedReports = challenge.data.completed_reports + 1;
      await supabase
        .from('challenges')
        .update({ completed_reports: newCompletedReports })
        .eq('id', id);

      return NextResponse.json({
        message: 'Check day recorded',
        completed_reports: newCompletedReports,
        success: true,
      }, { status: 200 });
    }

    if (action === 'finish') {
      if (!challenge.data.deadline_period) return NextResponse.json({ detail: 'No deadline period' }, { status: 400 });
      const { comment, media_url } = body;
      const [start, end] = challenge.data.deadline_period.split('/');
      if (!start || !end) return NextResponse.json({ detail: 'Invalid deadline period format' }, { status: 400 });
      const nowDateOnly = new Date(now.toISOString().split('T')[0]);
      const startDate = new Date(start);
      const endDate = new Date(end);
      if (nowDateOnly < startDate || nowDateOnly > endDate) {
        return NextResponse.json({ detail: 'Not in deadline period' }, { status: 400 });
      }
      // Проверяем, что отчета за дедлайн еще нет
      const { data: existingReports } = await supabase
        .from('challenge_reports')
        .select('report_date')
        .eq('challenge_id', id)
        .eq('user_id', user_id)
        .gte('report_date', start)
        .lte('report_date', end);
      if (existingReports?.length) return NextResponse.json({ detail: 'Report already submitted' }, { status: 400 });
      // Создаем отчет
      await supabase.from('challenge_reports').insert({
        user_id,
        challenge_id: id,
        report_date: now.toISOString(),
        comment: comment || '',
        media_url: media_url || null,
      });
      const newCompletedReports = challenge.data.completed_reports + 1;
      await supabase
        .from('challenges')
        .update({
          completed_reports: newCompletedReports,
          end_at: now.toISOString(),
          is_completed: true,
        })
        .eq('id', id);
      return NextResponse.json({
        message: 'Challenge finished',
        completed_reports: newCompletedReports,
        end_at: now.toISOString(),
        is_completed: true,
        success: true,
      }, { status: 200 });
    }

    return NextResponse.json({ detail: 'Invalid action' }, { status: 400 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Server error:', message);
    return NextResponse.json({ detail: `Server error: ${message}` }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ detail: 'Missing challenge id' }, { status: 400 });

    // Получаем user_id и is_completed по id
    const { data: challengeData, error: selectError } = await supabase
      .from('challenges')
      .select('user_id, is_completed')
      .eq('id', id)
      .single();
    
    if (selectError || !challengeData) {
      return NextResponse.json({ detail: 'Challenge not found' }, { status: 404 });
    }
    
    const { user_id, is_completed } = challengeData;

    const { error } = await supabase.from('challenges').delete().eq('id', id);
    if (error) throw error;

    // Уменьшаем счетчик promises
    await supabase.rpc('decrement_promises', { user_id });
    // Если челлендж был выполнен, уменьшаем promises_done
    if (is_completed) {
      await supabase.rpc('decrement_promises_done', { user_id });
    }

    return NextResponse.json({ message: 'Challenge deleted successfully' }, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ detail: `Server error: ${message}` }, { status: 500 });
  }
}