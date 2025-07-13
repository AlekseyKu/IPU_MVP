// frontend/src/app/api/users/[telegramId]/update/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ telegramId: string }> }
) {
  const { telegramId } = await context.params;
  const parsedId = parseInt(telegramId, 10);

  if (isNaN(parsedId)) {
    return NextResponse.json({ detail: 'Invalid telegramId' }, { status: 400 });
  }

  try {
    const { first_name, last_name, about } = await request.json();

    const { error } = await supabase
      .from('users')
      .update({
        first_name: first_name || null,
        last_name: last_name || null,
        about: about || null,
      })
      .eq('telegram_id', parsedId);

    if (error) {
      console.error('Database update error:', error);
      return NextResponse.json({ detail: `Update error: ${error.message}` }, { status: 500 });
    }

    return NextResponse.json({ message: 'User updated successfully' });
  } catch (err) {
    console.error('Unexpected server error:', err);
    return NextResponse.json({ detail: 'Internal server error' }, { status: 500 });
  }
}
