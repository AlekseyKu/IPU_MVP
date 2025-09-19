// frontend/src/app/api/leaders/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'all'; // 'day', 'week', 'all'
    const limit = 30; // Фиксированный лимит для топ-30

    let data: any[] = [];

    if (period === 'all') {
      // Для "за все время" используем обычный запрос
      const { data: allTimeData, error } = await supabase
        .from('users')
        .select(
          'telegram_id, first_name, last_name, username, avatar_img_url, karma_points, subscribers, promises, promises_done, challenges, challenges_done'
        )
        .not('karma_points', 'is', null)
        .gt('karma_points', 0)
        .order('karma_points', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching all-time leaders:', error);
        return NextResponse.json({ detail: 'Error fetching leaders' }, { status: 500 });
      }

      data = allTimeData || [];
    } else {
      // Для 'day' и 'week' используем агрегацию по транзакциям кармы
      let startDate: Date;
      
      if (period === 'day') {
        startDate = new Date();
        startDate.setHours(0, 0, 0, 0);
      } else if (period === 'week') {
        startDate = new Date();
        startDate.setDate(startDate.getDate() - 7);
        startDate.setHours(0, 0, 0, 0);
      } else {
        startDate = new Date(0); // fallback
      }

      // Получаем пользователей с их кармой за период через агрегацию транзакций
      const { data: periodData, error } = await supabase
        .from('karma_transactions')
        .select(`
          user_id,
          amount,
          users!inner(
            telegram_id, 
            first_name, 
            last_name, 
            username, 
            avatar_img_url, 
            subscribers, 
            promises, 
            promises_done, 
            challenges, 
            challenges_done
          )
        `)
        .gte('created_at', startDate.toISOString());

      if (error) {
        console.error('Error fetching period leaders:', error);
        return NextResponse.json({ detail: 'Error fetching leaders' }, { status: 500 });
      }

      // Агрегируем карму по пользователям за период
      const karmaByUser = new Map<number, { 
        user: any, 
        karma: number 
      }>();

      (periodData || []).forEach((transaction: any) => {
        const userId = transaction.user_id;
        const user = transaction.users;
        
        if (!karmaByUser.has(userId)) {
          karmaByUser.set(userId, {
            user: user,
            karma: 0
          });
        }
        
        karmaByUser.get(userId)!.karma += transaction.amount;
      });

      // Преобразуем в массив и сортируем по карме
      data = Array.from(karmaByUser.values())
        .filter(item => item.karma > 0) // Только пользователи с положительной кармой за период
        .sort((a, b) => b.karma - a.karma)
        .slice(0, limit)
        .map(item => ({
          ...item.user,
          karma_points: item.karma
        }));
    }

    // Добавляем позицию в рейтинге
    const leadersWithRank = data.map((user, index) => ({
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