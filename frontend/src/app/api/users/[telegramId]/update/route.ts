// frontend\src\app\api\users\[telegramId]\update\route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function PATCH(request: Request, context: { params: Promise<{ telegramId: string }> }) {
  const { telegramId } = await context.params;
  const { first_name, last_name, about } = await request.json();

  if (!telegramId) {
    return NextResponse.json({ detail: 'Missing telegramId' }, { status: 400 });
  }

  try {
    const { error } = await supabase
      .from('users')
      .update({
        first_name: first_name || null,
        last_name: last_name || null,
        about: about || null,
      })
      .eq('telegram_id', parseInt(telegramId, 10));

    if (error) {
      console.error('Supabase database error:', error);
      return NextResponse.json({ detail: `Database update error: ${error.message}` }, { status: 400 });
    }

    return NextResponse.json({ message: 'User data updated successfully' });
  } catch (error: unknown) {
    console.error('Error in update handler:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ detail: `Server error: ${errorMessage}` }, { status: 500 });
  }
}