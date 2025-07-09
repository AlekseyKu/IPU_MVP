// frontend/src/hooks/useUserData.ts
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface UserData {
  telegram_id: number;
  username: string | null;
  first_name: string | null;
  last_name: string | null;
  subscribers?: number;
  promises?: number;
  promises_done?: number;
  stars?: number;
  hero_img_url?: string;
  avatar_img_url?: string;
  about?: string;
  address?: string;
}

export const useUserData = (telegramId: number) => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const defaultHeroImg = '/assets/images/ipu/hero-img.png';
  const defaultAvatarImg = '/assets/images/ipu/avatar.png';

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      if (!telegramId) {
        setUserData(null);
        setIsLoading(false);
        return;
      }

      try {
        console.log(`Fetching user data for telegramId: ${telegramId}`);
        const { data, error } = await supabase
          .from('users')
          .select('telegram_id, username, first_name, last_name, subscribers, promises, promises_done, stars, hero_img_url, avatar_img_url, about, address')
          .eq('telegram_id', telegramId)
          .single();

        if (error) {
          console.error('Error fetching user data:', error.message);
          setUserData(null);
        } else if (data) {
          console.log('Fetched user data:', data);
          setUserData({
            telegram_id: data.telegram_id,
            username: data.username || '',
            first_name: data.first_name || '',
            last_name: data.last_name || '',
            subscribers: data.subscribers || 0,
            promises: data.promises || 0,
            promises_done: data.promises_done || 0,
            stars: data.stars || 0,
            hero_img_url: data.hero_img_url || defaultHeroImg,
            avatar_img_url: data.avatar_img_url || defaultAvatarImg,
            about: data.about || '',
            address: data.address || '',
          });
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

  return { userData, isLoading, defaultHeroImg, defaultAvatarImg };
};