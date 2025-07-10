// frontend/src/app/api/users/[telegramId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(request: NextRequest, { params }: { params: { telegramId: string } }) {
  const telegramId = parseInt(params.telegramId, 10);

  if (isNaN(telegramId)) {
    return NextResponse.json({ detail: 'Invalid telegramId' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('users')
    .select('telegram_id, username, first_name, last_name, about, hero_img_url, avatar_img_url, subscribers, promises, promises_done, stars')
    .eq('telegram_id', telegramId)
    .single();

  if (error || !data) {
    return NextResponse.json({ detail: 'User not found' }, { status: 404 });
  }

  return NextResponse.json(data);
}