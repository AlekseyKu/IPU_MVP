// frontend\src\app\api\users\[telegramId]\route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import { UserData } from '@/types';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ telegramId: string }> }
) {
  const { telegramId } = await context.params;
  const parsedTelegramId = Number(telegramId);

  if (isNaN(parsedTelegramId)) {
    return NextResponse.json({ detail: 'Invalid telegramId' }, { status: 400 });
  }

  try {
    const { data, error } = await supabase
      .from('users')
      .select(
        'telegram_id, first_name, last_name, username, about, avatar_img_url, hero_img_url, subscribers, promises, promises_done, challenges, challenges_done, karma_points'
      )
      .eq('telegram_id', parsedTelegramId)
      .single();

    if (error || !data) {
      return NextResponse.json({ detail: 'User not found' }, { status: 404 });
    }

    const userData: UserData = {
      telegram_id: data.telegram_id,
      first_name: data.first_name || '',
      last_name: data.last_name || '',
      username: data.username || '',
      about: data.about || '',
      avatar_img_url: data.avatar_img_url || '',
      hero_img_url: data.hero_img_url || '',
      subscribers: data.subscribers || 0,
      promises: data.promises || 0,
      promises_done: data.promises_done || 0,
      challenges: data.challenges || 0,
      challenges_done: data.challenges_done || 0,
      karma_points: data.karma_points || 0,
    };

    return NextResponse.json(userData);
  } catch (err) {
    console.error('Error fetching user:', err);
    return NextResponse.json({ detail: 'Internal server error' }, { status: 500 });
  }
}
