import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ telegramId: string }> }
) {
  const { telegramId } = await context.params;
  const parsedTelegramId = Number(telegramId);

  if (isNaN(parsedTelegramId)) {
    return NextResponse.json({ detail: 'Invalid telegramId' }, { status: 400 });
  }

  try {
    const { action } = await request.json();
    if (!action || !['increment', 'decrement'].includes(action)) {
      return NextResponse.json({ detail: 'Invalid action, use "increment" or "decrement"' }, { status: 400 });
    }

    const { data: user } = await supabase
      .from('users')
      .select('telegram_id, subscribers')
      .eq('telegram_id', parsedTelegramId)
      .single();

    if (!user) {
      return NextResponse.json({ detail: 'User not found' }, { status: 404 });
    }

    const newSubscribersCount = action === 'increment'
      ? (user.subscribers || 0) + 1
      : Math.max(0, (user.subscribers || 0) - 1);

    const { error } = await supabase
      .from('users')
      .update({ subscribers: newSubscribersCount })
      .eq('telegram_id', parsedTelegramId);

    if (error) {
      console.error('Error updating subscribers:', error.message);
      return NextResponse.json({ detail: 'Error updating subscribers' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Subscribers updated', subscribers: newSubscribersCount }, { status: 200 });
  } catch (error) {
    console.error('General error:', error);
    return NextResponse.json({ detail: 'Internal server error' }, { status: 500 });
  }
}