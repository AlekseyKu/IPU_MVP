import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import { awardKarma } from '@/utils/karmaService';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const followerId = Number(searchParams.get('follower_id'));
  const followedId = Number(searchParams.get('followed_id'));

  if (isNaN(followerId) || isNaN(followedId)) {
    return NextResponse.json({ detail: 'Invalid follower_id or followed_id' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('follower_id', followerId)
    .eq('followed_id', followedId);

  if (error) {
    console.error('Error fetching subscription:', error.message);
    return NextResponse.json({ detail: 'Error fetching subscription' }, { status: 500 });
  }

  return NextResponse.json(data || []);
}

export async function POST(request: NextRequest) {
  try {
    const { follower_id, followed_id } = await request.json();

    if (!follower_id || !followed_id || isNaN(follower_id) || isNaN(followed_id)) {
      return NextResponse.json({ detail: 'Invalid follower_id or followed_id' }, { status: 400 });
    }

    const { error } = await supabase
      .from('subscriptions')
      .insert({ follower_id, followed_id });

    if (error) {
      console.error('Error creating subscription:', error.message);
      return NextResponse.json({ detail: 'Subscription already exists or invalid data' }, { status: 400 });
    }

    // Начисляем карму за подписку
    try {
      await awardKarma(
        follower_id, 
        1, 
        'Подписка на пользователя', 
        'subscription', 
        null
      );
    } catch (karmaError) {
      console.error('Error awarding karma for subscription:', karmaError);
      // Не прерываем создание подписки, если карма не начислилась
    }

    return NextResponse.json({ message: 'Subscription created' }, { status: 201 });
  } catch (error) {
    console.error('General error:', error);
    return NextResponse.json({ detail: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { follower_id, followed_id } = await request.json();

    if (!follower_id || !followed_id || isNaN(follower_id) || isNaN(followed_id)) {
      return NextResponse.json({ detail: 'Invalid follower_id or followed_id' }, { status: 400 });
    }

    const { error } = await supabase
      .from('subscriptions')
      .delete()
      .eq('follower_id', follower_id)
      .eq('followed_id', followed_id);

    if (error) {
      console.error('Error deleting subscription:', error.message);
      return NextResponse.json({ detail: 'Subscription not found' }, { status: 404 });
    }

    // Списываем карму за отписку
    try {
      await awardKarma(
        follower_id, 
        -1, 
        'Отписка от пользователя', 
        'subscription', 
        null
      );
    } catch (karmaError) {
      console.error('Error deducting karma for unsubscription:', karmaError);
      // Не прерываем удаление подписки, если карма не списалась
    }

    return NextResponse.json({ message: 'Subscription deleted' }, { status: 200 });
  } catch (error) {
    console.error('General error:', error);
    return NextResponse.json({ detail: 'Internal server error' }, { status: 500 });
  }
}
