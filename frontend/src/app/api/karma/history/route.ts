import { NextRequest, NextResponse } from 'next/server';
import { getKarmaHistory } from '@/utils/karmaService';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    if (!userId) {
      return NextResponse.json(
        { detail: 'User ID is required' }, 
        { status: 400 }
      );
    }

    const history = await getKarmaHistory(parseInt(userId), limit, offset);

    return NextResponse.json(history);
  } catch (error) {
    console.error('Error in karma history API:', error);
    return NextResponse.json(
      { detail: 'Server error' }, 
      { status: 500 }
    );
  }
} 