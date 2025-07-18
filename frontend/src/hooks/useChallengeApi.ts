// frontend\src\hooks\useChallengeApi.ts
import { ChallengeData } from '@/types';

// interface CreateChallengeInput {
//   user_id: number;
//   title: string;
//   frequency: 'daily' | 'weekly' | 'monthly';
//   total_reports: number;
//   content?: string;
//   media_url?: string;
// }

export function useChallengeApi(
  updateChallenges: (challenge: ChallengeData, eventType: 'INSERT' | 'UPDATE' | 'DELETE') => void,
  setError: (msg: string) => void
) {
  const handleCreateChallenge = async (newChallenge: Omit<ChallengeData, 'id' | 'created_at' | 'is_completed'> & { media_url?: string }) => {
    try {
      const response = await fetch('/api/challenges', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newChallenge),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.detail || 'Ошибка создания челленджа');
      if (result.id) {
        updateChallenges({ ...newChallenge, id: result.id, created_at: new Date().toISOString(), is_completed: false } as ChallengeData, 'INSERT');
      }
      return result;
    } catch (error) {
      setError('Ошибка при создании челленджа');
      console.error('Ошибка при создании челленджа:', error);
      return null;
    }
  };

  const handleUpdateChallenge = async (updatedChallenge: ChallengeData) => {
    try {
      const response = await fetch('/api/challenges', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedChallenge),
      });
      if (!response.ok) throw new Error('Ошибка обновления челленджа');
      updateChallenges(updatedChallenge, 'UPDATE');
    } catch (error) {
      setError('Ошибка при обновлении челленджа');
      console.error('Ошибка при обновлении челленджа:', error);
    }
  };

  const handleDeleteChallenge = async (id: string) => {
    try {
      const response = await fetch(`/api/challenges?id=${id}`, {
        method: 'DELETE',
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.detail || 'Ошибка удаления челленджа');
      updateChallenges({ id } as ChallengeData, 'DELETE');
    } catch (error) {
      setError('Ошибка при удалении челленджа');
      console.error('Ошибка при удалении челленджа:', error);
    }
  };

  return { handleCreateChallenge, handleUpdateChallenge, handleDeleteChallenge };
} 