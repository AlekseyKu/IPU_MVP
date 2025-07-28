// frontend/src/app/api/challenges/[id]/participants/route.ts
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

interface ParticipantData {
  user_id: number;
  joined_at: string;
  users:
    | {
        telegram_id: number;
        username: string | null;
        first_name: string | null;
        last_name: string | null;
        avatar_img_url: string | null;
      }
    | {
        telegram_id: number;
        username: string | null;
        first_name: string | null;
        last_name: string | null;
        avatar_img_url: string | null;
      }[]
    | null;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json({ detail: 'Challenge ID is required' }, { status: 400 });
    }

    // Получаем участников челленджа с данными пользователей
    const { data: participants, error } = await supabase
      .from('challenge_participants')
      .select(`
        user_id,
        joined_at,
        users!challenge_participants_user_id_fkey (
          telegram_id,
          username,
          first_name,
          last_name,
          avatar_img_url
        )
      `)
      .eq('challenge_id', id)
      .order('joined_at', { ascending: true });

    if (error) {
      console.error('Error fetching participants:', error);
      return NextResponse.json({ detail: 'Error fetching participants' }, { status: 500 });
    }

    // console.log('RAW participants from supabase:', participants);


    // Форматируем данные для фронтенда
    const formattedParticipants = participants?.map((participant: ParticipantData) => {
      const user = Array.isArray(participant.users) ? participant.users[0] : participant.users;
      return {
        telegram_id: participant.user_id,
        username: user?.username,
        first_name: user?.first_name,
        last_name: user?.last_name,
        avatar_img_url: user?.avatar_img_url,
        joined_at: participant.joined_at
      };
    }) || [];

    return NextResponse.json(formattedParticipants, { status: 200 });

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Server error:', message);
    return NextResponse.json({ detail: `Server error: ${message}` }, { status: 500 });
  }
} 