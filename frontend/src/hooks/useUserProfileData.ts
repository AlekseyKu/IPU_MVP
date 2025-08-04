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
  // --- Новый блок: состояние для получателей обещаний ---
  const [recipients, setRecipients] = useState<Record<number, UserData>>({});
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
          const promisesData = promisesRes.data || [];
          setPromises(promisesData);
          
          // --- Новый блок: загрузка данных о получателях обещаний ---
          const recipientIds = promisesData
            .filter(p => p.recipient_id && p.recipient_id !== telegramId)
            .map(p => p.recipient_id!)
            .filter((id, index, arr) => arr.indexOf(id) === index);

          if (recipientIds.length > 0) {
            const { data: recipientsData, error: recipientsError } = await supabase
              .from('users')
              .select('telegram_id, first_name, last_name, username, avatar_img_url')
              .in('telegram_id', recipientIds);

            if (!recipientsError && recipientsData) {
              const mapped = recipientsData.reduce((acc, recipient) => {
                acc[recipient.telegram_id] = {
                  telegram_id: recipient.telegram_id,
                  first_name: recipient.first_name || '',
                  last_name: recipient.last_name || '',
                  username: recipient.username || '',
                  avatar_img_url: recipient.avatar_img_url || '',
                };
                return acc;
              }, {} as Record<number, UserData>);
              setRecipients(mapped);
            }
          }
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
    const userChannel = supabase.channel(`user-${telegramId}`);
    const subscriptionChannel = supabase.channel(`subscriptions-${telegramId}`);

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

    // Подписка на обновления пользователя (для кармы)
    userChannel
      .on('postgres_changes', 
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'users', 
          filter: `telegram_id=eq.${telegramId}` 
        }, 
                 (payload) => {
           if (payload.new) {
            setUserData((prev) => {
              if (!prev) return prev;
              const updatedData = {
                ...prev,
                karma_points: payload.new.karma_points || prev.karma_points,
                subscribers: payload.new.subscribers || prev.subscribers,
                promises: payload.new.promises || prev.promises,
                promises_done: payload.new.promises_done || prev.promises_done,
                challenges: payload.new.challenges || prev.challenges,
                challenges_done: payload.new.challenges_done || prev.challenges_done,
                             };
               return updatedData;
            });
          }
        }
      );

    // Подписка на обновления подписок (только если есть текущий пользователь и это не его профиль)
    if (currentUserId && !isOwnProfile) {
      subscriptionChannel
        .on('postgres_changes', 
          { 
            event: '*', 
            schema: 'public', 
            table: 'subscriptions',
            filter: `follower_id=eq.${currentUserId} AND followed_id=eq.${telegramId}`
          }, 
          (payload) => {
            if (payload.eventType === 'INSERT') {
              setIsSubscribed(true);
            } else if (payload.eventType === 'DELETE') {
              setIsSubscribed(false);
            }
          }
        );
    }

    promiseChannel.subscribe();
    challengeChannel.subscribe();
    userChannel.subscribe();
    subscriptionChannel.subscribe();

    return () => {
      supabase.removeChannel(promiseChannel);
      supabase.removeChannel(challengeChannel);
      supabase.removeChannel(userChannel);
      supabase.removeChannel(subscriptionChannel);
    };
  }, [telegramId]);

  return { userData, promises, challenges, isSubscribed, isLoading, error, setUserData, setIsSubscribed, setError, recipients };
}
