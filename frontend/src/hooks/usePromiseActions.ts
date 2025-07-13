// hooks/usePromiseActions.ts
import { supabase } from '@/lib/supabaseClient';
import { Dispatch, SetStateAction } from 'react';
import { UserData, PromiseData } from '@/types';

export default function usePromiseActions(
  telegramId: number,
  setUserData: Dispatch<SetStateAction<UserData | null>>,
  setError: Dispatch<SetStateAction<string | null>>
) {
  const handleSubscribe = async (telegramId: number, isSubscribed: boolean) => {
    try {
      const response = await fetch('/api/subscriptions', {
        method: isSubscribed ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ follower_id: telegramId, followed_id: telegramId }),
      });

      if (!response.ok) {
        throw new Error('Subscription action failed');
      }

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
      setError('Error updating subscription');
      throw error;
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from('promises').delete().eq('id', id);
      if (error) throw error;

      setUserData((prev) =>
        prev ? { ...prev, promises: Math.max(0, (prev.promises ?? 0) - 1) } : prev
      );
    } catch (error) {
      setError('Error updating promises in DB');
      console.error('Error:', error);
    }
  };

  const handleUpdate = async (updatedPromise: PromiseData) => {
    try {
      const { error } = await supabase
        .from('promises')
        .update(updatedPromise)
        .eq('id', updatedPromise.id);

      if (error) throw error;

      setUserData((prev) =>
        prev
          ? {
              ...prev,
              promises_done: updatedPromise.is_completed
                ? (prev.promises_done ?? 0) + 1
                : Math.max(0, (prev.promises_done ?? 1) - 1),
            }
          : prev
      );
    } catch (error) {
      setError('Error updating promises_done in DB');
      console.error('Error:', error);
    }
  };

  return { handleSubscribe, handleDelete, handleUpdate };
}
