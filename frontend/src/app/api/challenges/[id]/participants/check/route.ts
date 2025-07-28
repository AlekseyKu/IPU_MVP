// frontend/src/app/api/challenges/[id]/participants/check/route.ts
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');
    
    if (!id) {
      return NextResponse.json({ detail: 'Challenge ID is required' }, { status: 400 });
    }
    
    if (!userId) {
      return NextResponse.json({ detail: 'User ID is required' }, { status: 400 });
    }

    // Проверяем участие пользователя в челлендже
    const { data: participant, error } = await supabase
      .from('challenge_participants')
      .select('id, joined_at')
      .eq('challenge_id', id)
      .eq('user_id', parseInt(userId))
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Error checking participation:', error);
      return NextResponse.json({ detail: 'Error checking participation' }, { status: 500 });
    }

    const isParticipant = !!participant;

    return NextResponse.json({ 
      isParticipant,
      joined_at: participant?.joined_at || null
    }, { status: 200 });

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Server error:', message);
    return NextResponse.json({ detail: `Server error: ${message}` }, { status: 500 });
  }
} 