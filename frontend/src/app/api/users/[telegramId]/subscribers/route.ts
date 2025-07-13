// frontend/src/app/api/users/[telegramId]/subscribers/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

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

    if (!['increment', 'decrement'].includes(action)) {
      return NextResponse.json({ detail: 'Invalid action, use "increment" or "decrement"' }, { status: 400 });
    }

    const { data: user, error: fetchError } = await supabase
      .from('users')
      .select('subscribers')
      .eq('telegram_id', parsedTelegramId)
      .single();

    if (fetchError || !user) {
      return NextResponse.json({ detail: 'User not found' }, { status: 404 });
    }

    const updatedCount =
      action === 'increment'
        ? (user.subscribers ?? 0) + 1
        : Math.max(0, (user.subscribers ?? 0) - 1);

    const { error: updateError } = await supabase
      .from('users')
      .update({ subscribers: updatedCount })
      .eq('telegram_id', parsedTelegramId);

    if (updateError) {
      console.error('Error updating subscribers:', updateError.message);
      return NextResponse.json({ detail: 'Error updating subscribers' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Subscribers updated', subscribers: updatedCount });
  } catch (error) {
    console.error('Unhandled error:', error);
    return NextResponse.json({ detail: 'Internal server error' }, { status: 500 });
  }
}
