// frontend/src/hooks/useUserData.ts
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { UserData } from '@/types';
import { RealtimeChannel } from '@supabase/supabase-js';

interface UserDataConfig {
  telegramId: number;
  onPostsUpdate?: (payload: any) => void;
  onChallengesUpdate?: (payload: any) => void;
}

export const useUserData = ({ 
  telegramId, 
  onPostsUpdate, 
  onChallengesUpdate 
}: UserDataConfig) => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const defaultHeroImg = '/assets/images/ipu/hero-img.png';
  const defaultAvatarImg = '/assets/images/defaultAvatar.svg';
  const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const currentStatsRef = useRef({ promises: 0, promises_done: 0, challenges: 0, challenges_done: 0 });
  const channelsRef = useRef<RealtimeChannel[]>([]);
  const isSetupRef = useRef(false);
  const processedEventsRef = useRef<Set<string>>(new Set());

  // Первоначальная загрузка данных пользователя
  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      if (!telegramId) {
        setUserData(null);
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('users')
          .select('telegram_id, username, first_name, last_name, subscribers, promises, promises_done, challenges, challenges_done, karma_points, hero_img_url, avatar_img_url, about, email')
          .eq('telegram_id', telegramId)
          .single();

        if (error) {
          console.error('Error fetching user data:', error.message);
          setUserData(null);
                 } else if (data) {
           const newUserData = {
             telegram_id: data.telegram_id,
             username: data.username || '',
             first_name: data.first_name || '',
             last_name: data.last_name || '',
             subscribers: data.subscribers || 0,
             promises: data.promises || 0,
             promises_done: data.promises_done || 0,
             challenges: data.challenges || 0,
             challenges_done: data.challenges_done || 0,
             karma_points: data.karma_points || 0,
             hero_img_url: data.hero_img_url || defaultHeroImg,
             avatar_img_url: data.avatar_img_url || defaultAvatarImg,
             about: data.about || '',
             email: data.email || '',
                        };
           
           setUserData(newUserData);
          
          // Обновляем ref с текущими значениями
          currentStatsRef.current = {
            promises: newUserData.promises || 0,
            promises_done: newUserData.promises_done || 0,
            challenges: newUserData.challenges || 0,
            challenges_done: newUserData.challenges_done || 0
          };
        }
      } catch (error) {
        console.error('General error:', error);
        setUserData(null);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [telegramId]);

  // Централизованная система real-time подписок
  useEffect(() => {
    if (!telegramId) return;

    // Защита от множественных подписок в React Strict Mode
    if (isSetupRef.current) {
      return;
    }

    isSetupRef.current = true;

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
          // Используем ref для текущих значений
          const currentStats = currentStatsRef.current;
          const newStats = {
            promises: payload.new.promises || 0,
            promises_done: payload.new.promises_done || 0,
            challenges: payload.new.challenges || 0,
            challenges_done: payload.new.challenges_done || 0
          };
          
                                // Проверяем изменение кармы отдельно
           const currentKarma = userData?.karma_points || 0;
           const newKarma = payload.new.karma_points || 0;
           const karmaChanged = currentKarma !== newKarma;
          
          // Обновляем только если данные действительно изменились
          if (JSON.stringify(currentStats) !== JSON.stringify(newStats) || karmaChanged) {
            // НЕМЕДЛЕННО обновляем ref с новыми значениями
            currentStatsRef.current = { ...newStats };
            
            // Очищаем предыдущий таймаут
            if (updateTimeoutRef.current) {
              clearTimeout(updateTimeoutRef.current);
            }
            
                         // Добавляем небольшую задержку для предотвращения двойного обновления
             updateTimeoutRef.current = setTimeout(() => {
               const updatedData = payload.new as UserData;
               const newUserData = {
                 telegram_id: updatedData.telegram_id,
                 username: updatedData.username || '',
                 first_name: updatedData.first_name || '',
                 last_name: updatedData.last_name || '',
                 subscribers: updatedData.subscribers || 0,
                 promises: updatedData.promises || 0,
                 promises_done: updatedData.promises_done || 0,
                 challenges: updatedData.challenges || 0,
                 challenges_done: updatedData.challenges_done || 0,
                 karma_points: updatedData.karma_points || 0,
                 hero_img_url: updatedData.hero_img_url || defaultHeroImg,
                 avatar_img_url: updatedData.avatar_img_url || defaultAvatarImg,
                 about: updatedData.about || '',
                 email: updatedData.email || '',
                                };
                 setUserData(newUserData);
             }, 100); // 100ms задержка
          }
        }
      )
      .subscribe();
    
    channelsRef.current.push(userStatsChannel);

    // 2. Подписка на обновления списка постов (promises)
    if (onPostsUpdate) {
      const postsChannel = supabase
        .channel(`posts-${telegramId}-${Date.now()}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'promises'
          },
                     (payload) => {
             // Фильтруем события на уровне обработчика
             const isOwnPromise = (payload.new as any)?.user_id === telegramId;
             const isReceivedPromise = (payload.new as any)?.recipient_id === telegramId;
             
             // Обрабатываем только релевантные события
             if (isOwnPromise || isReceivedPromise || payload.eventType === 'DELETE') {
               onPostsUpdate(payload);
             }
           }
        )
        .subscribe();
      
      channelsRef.current.push(postsChannel);
    }

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
          onChallengesUpdate?.(payload);
        }
      )
      .subscribe();
    
    channelsRef.current.push(challengesChannel);

    // 4. Подписка на обновления karma_transactions (для отладки)
    const karmaTransactionsChannel = supabase
      .channel(`karma-transactions-${telegramId}-${Date.now()}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'karma_transactions',
          filter: `user_id=eq.${telegramId}`
        },
                 (payload) => {
           // Karma transaction received
         }
      )
      .subscribe();
    
    channelsRef.current.push(karmaTransactionsChannel);

    return () => {
      // Сбрасываем флаг
      isSetupRef.current = false;
      
      // Очищаем таймаут
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
      
      // Удаляем все каналы
      channelsRef.current.forEach(channel => {
        supabase.removeChannel(channel);
      });
      channelsRef.current = [];
    };
  }, [telegramId, onPostsUpdate, onChallengesUpdate]);

  return { userData, isLoading, defaultHeroImg, defaultAvatarImg };
};