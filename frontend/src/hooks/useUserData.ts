// frontend/src/hooks/useUserData.ts
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { UserData } from '@/types';

export const useUserData = (telegramId: number) => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const defaultHeroImg = '/assets/images/ipu/hero-img.png';
  const defaultAvatarImg = '/assets/images/defaultAvatar.svg';
  const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const currentStatsRef = useRef({ promises: 0, promises_done: 0, challenges: 0, challenges_done: 0 });
  const subscriptionRef = useRef<string | null>(null);

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
          .select('telegram_id, username, first_name, last_name, subscribers, promises, promises_done, challenges, challenges_done, stars, hero_img_url, avatar_img_url, about, address')
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
            stars: data.stars || 0,
            hero_img_url: data.hero_img_url || defaultHeroImg,
            avatar_img_url: data.avatar_img_url || defaultAvatarImg,
            about: data.about || '',
            address: data.address || '',
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

  // Подписка на изменения данных пользователя в реальном времени
  useEffect(() => {
    if (!telegramId) return;

    // Проверяем, что подписка еще не создана
    if (subscriptionRef.current) {
      return;
    }

    const channelName = `user-data-${telegramId}-${Date.now()}`;
    subscriptionRef.current = channelName;
    
    const channel = supabase
      .channel(channelName)
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
          
          // Обновляем только если данные действительно изменились
          if (JSON.stringify(currentStats) !== JSON.stringify(newStats)) {
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
                stars: updatedData.stars || 0,
                hero_img_url: updatedData.hero_img_url || defaultHeroImg,
                avatar_img_url: updatedData.avatar_img_url || defaultAvatarImg,
                about: updatedData.about || '',
                address: updatedData.address || '',
              };
              
              setUserData(newUserData);
            }, 100); // 100ms задержка
          }
        }
      )
      .subscribe();

    return () => {
      subscriptionRef.current = null;
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
      supabase.removeChannel(channel);
    };
  }, [telegramId]); // Только telegramId в зависимостях

  return { userData, isLoading, defaultHeroImg, defaultAvatarImg };
};