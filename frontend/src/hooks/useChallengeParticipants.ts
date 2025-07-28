// frontend/src/hooks/useChallengeParticipants.ts
import { useState, useCallback } from 'react';
import React from 'react';
import useUserSubscription from './useUserSubscription';

export interface ChallengeParticipant {
  telegram_id: number;
  username: string | null;
  first_name: string | null;
  last_name: string | null;
  avatar_img_url?: string;
  joined_at: string;
}

export function useChallengeParticipants(
  ownerTelegramId?: number,
  setOwnerUserData?: React.Dispatch<React.SetStateAction<any>>,
  setOwnerError?: React.Dispatch<React.SetStateAction<string | null>>
) {
  const [participants, setParticipants] = useState<ChallengeParticipant[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Хук для подписки на владельца челленджа
  const { handleSubscribe } = useUserSubscription(
    ownerTelegramId || 0,
    setOwnerUserData || (() => {}),
    setOwnerError || (() => {})
  );

  // Получение участников челленджа
  const fetchParticipants = useCallback(async (challengeId: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/challenges/${challengeId}/participants`);
      if (!response.ok) {
        throw new Error('Failed to fetch participants');
      }
      
      const data = await response.json();
      setParticipants(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      console.error('Error fetching participants:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Проверка участия пользователя в челлендже
  const checkParticipation = useCallback(async (challengeId: string, userId: number): Promise<boolean> => {
    try {
      const response = await fetch(`/api/challenges/${challengeId}/participants/check?user_id=${userId}`);
      if (!response.ok) {
        throw new Error('Failed to check participation');
      }
      
      const data = await response.json();
      return data.isParticipant;
    } catch (err) {
      console.error('Error checking participation:', err);
      return false;
    }
  }, []);

  // Присоединение к челленджу
  const joinChallenge = useCallback(async (challengeId: string, userId: number) => {
    try {
      const response = await fetch(`/api/challenges?id=${challengeId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, action: 'joinChallenge' }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to join challenge');
      }
      
      // Обновляем список участников
      await fetchParticipants(challengeId);
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      console.error('Error joining challenge:', err);
      return false;
    }
  }, [fetchParticipants]);

  // Отписка от челленджа
  const leaveChallenge = useCallback(async (challengeId: string, userId: number) => {
    try {
      const response = await fetch(`/api/challenges?id=${challengeId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, action: 'leaveChallenge' }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to leave challenge');
      }
      
      // Обновляем список участников
      await fetchParticipants(challengeId);
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      console.error('Error leaving challenge:', err);
      return false;
    }
  }, [fetchParticipants]);

  // Переключение участия (присоединиться/отписаться)
  const toggleParticipation = useCallback(async (challengeId: string, userId: number) => {
    const isParticipant = await checkParticipation(challengeId, userId);
    
    if (isParticipant) {
      return await leaveChallenge(challengeId, userId);
    } else {
      return await joinChallenge(challengeId, userId);
    }
  }, [checkParticipation, joinChallenge, leaveChallenge]);

  return {
    participants,
    isLoading,
    error,
    fetchParticipants,
    checkParticipation,
    joinChallenge,
    leaveChallenge,
    toggleParticipation,
  };
} 