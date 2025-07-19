// frontend\src\hooks\usePromiseApi.ts
import { PromiseData } from '@/types';

export function usePromiseApi(
  updatePosts: (post: PromiseData, eventType: 'INSERT' | 'UPDATE' | 'DELETE') => void,
  setError: (msg: string) => void
) {

  const handleCreate = async (newPromise: Omit<PromiseData, 'id' | 'created_at' | 'is_completed'> & { media_url?: string }) => {
    try {
      const response = await fetch('/api/promises', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPromise),
      });
      if (!response.ok) throw new Error('Ошибка создания');
      const result = await response.json();
      if (result.promise) {
        updatePosts(result.promise, 'INSERT');
      }
      return result.promise;
    } catch (error) {
      setError('Ошибка при создании обещания');
      console.error('Error:', error);
      return null;
    }
  };

  const handleUpdate = async (updatedPromise: PromiseData) => {
    try {
      const response = await fetch('/api/promises', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedPromise),
      });
      if (!response.ok) throw new Error('Ошибка обновления');
      updatePosts(updatedPromise, 'UPDATE');
    } catch (error) {
      setError('Ошибка при обновлении обещания');
      console.error('Error:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch('/api/promises', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (!response.ok) throw new Error('Ошибка удаления');
      updatePosts({ id } as PromiseData, 'DELETE');
    } catch (error) {
      setError('Ошибка при удалении обещания');
      console.error('Error:', error);
    }
  }; 

  return { handleDelete, handleUpdate, handleCreate };
} 