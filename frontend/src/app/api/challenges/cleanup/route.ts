// frontend/src/app/api/challenges/cleanup/route.ts
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function POST() {
  try {
    // Получаем все челленджи с subscribers
    const { data: challenges, error } = await supabase
      .from('challenges')
      .select('id, subscribers')
      .not('subscribers', 'is', null);

    if (error) {
      console.error('Error fetching challenges:', error);
      return NextResponse.json({ detail: 'Error fetching challenges' }, { status: 500 });
    }

    let cleanedCount = 0;

    for (const challenge of challenges || []) {
      if (challenge.subscribers && Array.isArray(challenge.subscribers)) {
        // Удаляем дубликаты, сохраняя уникальные значения
        const uniqueSubscribers = [...new Set(challenge.subscribers)];
        
        if (uniqueSubscribers.length !== challenge.subscribers.length) {
          // Обновляем только если есть изменения
          const { error: updateError } = await supabase
            .from('challenges')
            .update({ subscribers: uniqueSubscribers })
            .eq('id', challenge.id);
          
          if (updateError) {
            console.error(`Error updating challenge ${challenge.id}:`, updateError);
          } else {
            cleanedCount++;
          }
        }
      }
    }

    return NextResponse.json({ 
      message: `Cleaned ${cleanedCount} challenges`, 
      cleanedCount 
    }, { status: 200 });

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Server error:', message);
    return NextResponse.json({ detail: `Server error: ${message}` }, { status: 500 });
  }
} 