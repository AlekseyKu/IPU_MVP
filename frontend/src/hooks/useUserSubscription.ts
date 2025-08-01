// hooks/useUserSubscription.ts
import { supabase } from '@/lib/supabaseClient';
import { Dispatch, SetStateAction } from 'react';
import { UserData, PromiseData } from '@/types';

export default function useUserSubscription(
  telegramId: number,
  setUserData: Dispatch<SetStateAction<UserData | null>>,
  setError: Dispatch<SetStateAction<string | null>>
) {
  const handleSubscribe = async (followedId: number, isSubscribed: boolean) => {
    try {
      const response = await fetch('/api/subscriptions', {
        method: isSubscribed ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ follower_id: telegramId, followed_id: followedId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Subscription action failed');
      }

      // Обновляем локальное состояние подписчиков
      setUserData((prev) =>
        prev
          ? {
              ...prev,
              subscribers: isSubscribed
                ? Math.max(0, (prev.subscribers ?? 0) - 1)
                : (prev.subscribers ?? 0) + 1,
            }
          : prev
      );
    } catch (error) {
      console.error('Subscription error:', error);
      setError('Error updating subscription');
      throw error;
    }
  };

  return { handleSubscribe };
}
