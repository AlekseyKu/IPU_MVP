// hooks/useUserProfileData.ts
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { PromiseData, UserData } from '@/types';

export function useUserProfileData(telegramId: number, currentUserId?: number | null) {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [promises, setPromises] = useState<PromiseData[]>([]);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isOwnProfile = telegramId === currentUserId;

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const [profileRes, promisesRes] = await Promise.all([
          fetch(`/api/users/${telegramId}`),
          supabase
            .from('promises')
            .select('*')
            .eq('user_id', telegramId)
            .eq('is_public', true)
            .order('created_at', { ascending: false }),
        ]);

        if (!profileRes.ok) throw new Error('User not found');

        const profile: UserData = await profileRes.json();
        setUserData(profile);

        if (!promisesRes.error) {
          setPromises(promisesRes.data || []);
        }

        if (currentUserId && !isOwnProfile) {
          const subRes = await fetch(`/api/subscriptions?follower_id=${currentUserId}&followed_id=${telegramId}`);
          const subData = await subRes.json();
          setIsSubscribed(!!subData.length);
        }

        setError(null);
      } catch (err: any) {
        setError(err.message || 'Error loading data');
      } finally {
        setIsLoading(false);
      }
    }

    if (telegramId) fetchData();
  }, [telegramId, currentUserId]);

  useEffect(() => {
    if (!telegramId) return;

    const channel = supabase.channel(`promises-${telegramId}`);

    const subscribe = async () => {
        channel
        .on('postgres_changes', { event: '*', schema: 'public', table: 'promises' }, (payload) => {
            const data = payload.new as PromiseData;
            switch (payload.eventType) {
            case 'INSERT':
                setPromises((prev) => [data, ...prev]);
                break;
            case 'UPDATE':
                setPromises((prev) => prev.map((p) => (p.id === data.id ? data : p)));
                break;
            case 'DELETE':
                setPromises((prev) => prev.filter((p) => p.id !== payload.old.id));
                break;
            }
        });

        await channel.subscribe();
    };

    subscribe(); // запуск подписки

    return () => {
        supabase.removeChannel(channel);
    };
    }, [telegramId]);


  return { userData, promises, isSubscribed, isLoading, error, setUserData, setIsSubscribed, setError };
}
