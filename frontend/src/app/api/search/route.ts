import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q')?.trim() || '';
  if (q.length < 3) {
    return NextResponse.json({ users: [] });
  }
  // Поиск по username, first_name, last_name (ILIKE)
  const { data, error } = await supabase
    .from('users')
    .select('telegram_id, username, first_name, last_name, avatar_img_url')
    .or(`username.ilike.%${q}%,first_name.ilike.%${q}%,last_name.ilike.%${q}%`)
    .limit(10);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ users: data || [] });
} 