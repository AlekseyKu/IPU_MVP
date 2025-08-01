import { NextRequest, NextResponse } from 'next/server';
import { awardKarma } from '@/utils/karmaService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      user_id, 
      amount, 
      reason, 
      related_entity_type, 
      related_entity_id 
    } = body;

    if (!user_id || !amount || !reason) {
      return NextResponse.json(
        { detail: 'Missing required fields: user_id, amount, reason' }, 
        { status: 400 }
      );
    }

    await awardKarma(
      parseInt(user_id), 
      amount, 
      reason, 
      related_entity_type, 
      related_entity_id
    );

    return NextResponse.json({ 
      message: 'Karma awarded successfully',
      user_id,
      amount,
      reason
    });
  } catch (error) {
    console.error('Error in karma award API:', error);
    return NextResponse.json(
      { detail: 'Server error' }, 
      { status: 500 }
    );
  }
} 