// frontend/src/app/api/leaders/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'all'; // 'day', 'week', 'all'
    const limit = 30; // Фиксированный лимит для топ-30

    let query = supabase
      .from('users')
      .select(
        'telegram_id, first_name, last_name, username, avatar_img_url, karma_points, subscribers, promises, promises_done, challenges, challenges_done'
      )
      .not('karma_points', 'is', null)
      .gt('karma_points', 0);

    // Фильтрация по периоду
    if (period === 'day') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      query = query.gte('created_at', today.toISOString());
    } else if (period === 'week') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      query = query.gte('created_at', weekAgo.toISOString());
    }
    // Для 'all' фильтрация не применяется

    const { data, error } = await query
      .order('karma_points', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching leaders:', error);
      return NextResponse.json({ detail: 'Error fetching leaders' }, { status: 500 });
    }

    // Добавляем позицию в рейтинге
    const leadersWithRank = (data || []).map((user, index) => ({
      ...user,
      rank: index + 1,
      display_name: `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.username || `@${user.telegram_id}`,
      avatar_img_url: user.avatar_img_url || '/assets/images/defaultAvatar.png'
    }));

    return NextResponse.json(leadersWithRank);
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ detail: 'Internal server error' }, { status: 500 });
  }
} 