// frontend\src\hooks\useChallengeApi.ts
import { ChallengeData } from '@/types';

interface CreateChallengeInput {
  user_id: number;
  title: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  total_reports: number;
  content?: string;
  media_url?: string;
}

export function useChallengeApi() {
  const handleCreateChallenge = async (challenge: CreateChallengeInput) => {
    try {
      const response = await fetch('/api/challenges', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(challenge),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.detail || 'Ошибка создания челленджа');
      return { success: true, ...result };
    } catch (error: any) {
      console.error('Ошибка при создании челленджа:', error.message || error);
      return { success: false, error: error.message || 'Ошибка создания челленджа' };
    }
  };

  const handleDeleteChallenge = async (id: string) => {
    try {
      const response = await fetch(`/api/challenges?id=${id}`, {
        method: 'DELETE',
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.detail || 'Ошибка удаления челленджа');
      return { success: true };
    } catch (error: any) {
      console.error('Ошибка при удалении челленджа:', error.message || error);
      return { success: false, error: error.message || 'Ошибка удаления челленджа' };
    }
  };

  return { handleCreateChallenge, handleDeleteChallenge };
} 