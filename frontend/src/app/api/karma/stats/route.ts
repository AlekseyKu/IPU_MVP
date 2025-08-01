import { NextRequest, NextResponse } from 'next/server';
import { getKarmaStats } from '@/utils/karmaService';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');

    if (!userId) {
      return NextResponse.json(
        { detail: 'User ID is required' }, 
        { status: 400 }
      );
    }

    const stats = await getKarmaStats(parseInt(userId));

    if (!stats) {
      return NextResponse.json(
        { detail: 'User not found' }, 
        { status: 404 }
      );
    }

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error in karma stats API:', error);
    return NextResponse.json(
      { detail: 'Server error' }, 
      { status: 500 }
    );
  }
} 