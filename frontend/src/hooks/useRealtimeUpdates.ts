// frontend/src/hooks/useRealtimeUpdates.ts
import { useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { RealtimeChannel } from '@supabase/supabase-js';

interface RealtimeUpdatesConfig {
  telegramId: number;
  onUserStatsUpdate?: (payload: any) => void;
  onPostsUpdate?: (payload: any) => void;
  onChallengesUpdate?: (payload: any) => void;
}

export const useRealtimeUpdates = ({
  telegramId,
  onUserStatsUpdate,
  onPostsUpdate,
  onChallengesUpdate
}: RealtimeUpdatesConfig) => {
  const channelsRef = useRef<RealtimeChannel[]>([]);

  useEffect(() => {
    if (!telegramId) return;

    console.log('🔄 Setting up realtime updates for telegramId:', telegramId);

    // 1. Подписка на обновления статистики пользователя
    const userStatsChannel = supabase
      .channel(`user-stats-${telegramId}-${Date.now()}`)
      .on(
        'postgres_changes',
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'users', 
          filter: `telegram_id=eq.${telegramId}` 
        },
        (payload) => {
          console.log('📊 User stats updated:', payload);
          onUserStatsUpdate?.(payload);
        }
      )
      .subscribe();
    
    channelsRef.current.push(userStatsChannel);

    // 2. Подписка на обновления списка постов (promises)
    const postsChannel = supabase
      .channel(`posts-${telegramId}-${Date.now()}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'promises',
          filter: `user_id=eq.${telegramId}`
        },
        (payload) => {
          console.log('📝 Posts updated (own):', payload);
          console.log('🔍 Filter: user_id=eq.' + telegramId);
          onPostsUpdate?.(payload);
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'promises',
          filter: `recipient_id=eq.${telegramId}`
        },
        (payload) => {
          console.log('📝 Posts updated (received):', payload);
          console.log('🔍 Filter: recipient_id=eq.' + telegramId);
          onPostsUpdate?.(payload);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'promises'
        },
        (payload) => {
          console.log('📝 Posts DELETE (ALL - DEBUG):', payload);
          console.log('🔍 No filter - DELETE promises changes');
          console.log('🔍 payload.old:', payload.old);
          console.log('🔍 payload.old type:', typeof payload.old);
          console.log('🔍 payload.old keys:', payload.old ? Object.keys(payload.old) : 'null');
          console.log('🔍 current telegramId:', telegramId);
          
          // Всегда вызываем onPostsUpdate для DELETE событий
          // (loadUserData() будет вызван в обработчике)
          console.log('✅ Calling onPostsUpdate for DELETE event');
          onPostsUpdate?.(payload);
        }
      )
      .subscribe((status) => {
        console.log('📝 Posts subscription status:', status);
        if (status === 'SUBSCRIBED') {
          console.log('✅ Posts subscription active');
        } else if (status === 'CHANNEL_ERROR') {
          console.log('❌ Posts subscription error');
        }
      });
    
    channelsRef.current.push(postsChannel);

    // 3. Подписка на обновления challenges
    const challengesChannel = supabase
      .channel(`challenges-${telegramId}-${Date.now()}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'challenges',
          filter: `user_id=eq.${telegramId}`
        },
        (payload) => {
          console.log('🏆 Challenges updated:', payload);
          onChallengesUpdate?.(payload);
        }
      )
      .subscribe();
    
    channelsRef.current.push(challengesChannel);

    return () => {
      console.log('🧹 Cleaning up realtime updates for telegramId:', telegramId);
      
      // Удаляем все каналы
      channelsRef.current.forEach(channel => {
        supabase.removeChannel(channel);
      });
      channelsRef.current = [];
    };
  }, [telegramId, onUserStatsUpdate, onPostsUpdate, onChallengesUpdate]);

  return {
    channels: channelsRef.current
  };
};