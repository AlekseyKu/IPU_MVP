// hooks/usePublicPromises.ts
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { PromiseData, User } from '@/types';

export function usePublicPromises(currentUserId: number | null) {
  const [promises, setPromises] = useState<PromiseData[]>([]);
  const [users, setUsers] = useState<Record<number, User>>({});
  const [subscriptions, setSubscriptions] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function fetchData() {
      setIsLoading(true);
      try {
        const [{ data: promiseData, error: pErr }, { data: userData, error: uErr }, subResult] =
          await Promise.all([
            supabase.from('promises').select('*').eq('is_public', true).order('created_at', { ascending: false }),
            supabase.from('users').select('telegram_id, first_name, last_name, username, avatar_img_url'),
            currentUserId
              ? supabase.from('subscriptions').select('followed_id').eq('follower_id', currentUserId)
              : Promise.resolve({ data: [], error: null }),
          ]);

        if (!mounted) return;

        if (!pErr) setPromises(promiseData || []);
        if (!uErr) {
          const mapped = (userData || []).reduce((acc, u) => {
            if (u.telegram_id)
              acc[u.telegram_id] = {
                ...u,
                first_name: u.first_name || '',
                last_name: u.last_name || '',
                username: u.username || '',
                avatar_img_url: u.avatar_img_url || '',
              };
            return acc;
          }, {} as Record<number, User>);
          setUsers(mapped);
        }

        if (subResult?.data) {
          setSubscriptions(subResult.data.map((sub) => sub.followed_id));
        }
      } catch (error) {
        console.error('Ошибка загрузки:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();

    const channel = supabase
      .channel('public-promises')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'promises', filter: 'is_public=eq.true' }, (payload) => {
        const data = payload.new as PromiseData;
        setPromises((prev) => {
          switch (payload.eventType) {
            case 'INSERT':
              return [data, ...prev];
            case 'UPDATE':
              return prev.map((p) => (p.id === data.id ? data : p));
            default:
              return prev;
          }
        });
      })
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(channel);
    };
  }, [currentUserId]);

  return { promises, users, subscriptions, isLoading };
}
