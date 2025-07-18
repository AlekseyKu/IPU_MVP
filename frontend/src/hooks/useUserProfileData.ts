// hooks/useUserProfileData.ts
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { PromiseData, UserData, ChallengeData } from '@/types';

export function useUserProfileData(telegramId: number, currentUserId?: number | null) {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [promises, setPromises] = useState<PromiseData[]>([]);
  const [challenges, setChallenges] = useState<ChallengeData[]>([]);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isOwnProfile = telegramId === currentUserId;

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const [profileRes, promisesRes, challengesRes] = await Promise.all([
          fetch(`/api/users/${telegramId}`),
          supabase
            .from('promises')
            .select('*')
            .eq('user_id', telegramId)
            .eq('is_public', true)
            .order('created_at', { ascending: false }),
          supabase
            .from('challenges')
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
        if (!challengesRes.error) {
          setChallenges(challengesRes.data || []);
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

    const promiseChannel = supabase.channel(`promises-${telegramId}`);
    const challengeChannel = supabase.channel(`challenges-${telegramId}`);

    promiseChannel
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

    challengeChannel
      .on('postgres_changes', { event: '*', schema: 'public', table: 'challenges' }, (payload) => {
        const data = payload.new as ChallengeData;
        switch (payload.eventType) {
          case 'INSERT':
            setChallenges((prev) => [data, ...prev]);
            break;
          case 'UPDATE':
            setChallenges((prev) => prev.map((c) => (c.id === data.id ? data : c)));
            break;
          case 'DELETE':
            setChallenges((prev) => prev.filter((c) => c.id !== payload.old.id));
            break;
        }
      });

    promiseChannel.subscribe();
    challengeChannel.subscribe();

    return () => {
      supabase.removeChannel(promiseChannel);
      supabase.removeChannel(challengeChannel);
    };
  }, [telegramId]);

  return { userData, promises, challenges, isSubscribed, isLoading, error, setUserData, setIsSubscribed, setError };
}
