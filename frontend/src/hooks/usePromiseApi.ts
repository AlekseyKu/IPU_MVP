// frontend\src\hooks\usePromiseApi.ts
import { PromiseData } from '@/types';

export function usePromiseApi(
  updatePosts: (post: PromiseData, eventType: 'INSERT' | 'UPDATE' | 'DELETE') => void,
  setError: (msg: string) => void
) {

  const handleCreate = async (newPromise: Omit<PromiseData, 'id' | 'created_at' | 'is_completed'> & { media_url?: string; hashtags?: string[] }) => {
    try {
      console.log('🚀 Creating promise...');
      const response = await fetch('/api/promises', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPromise),
      });
      if (!response.ok) throw new Error('Ошибка создания');
      const result = await response.json();
      if (result.promise) {
        // Убираем клиентское обновление - оставляем только серверное через триггеры
        // updatePosts(result.promise, 'INSERT');
        console.log('✅ Promise created, waiting for server update via triggers');
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
      console.log('🗑️ Deleting promise...');
      const response = await fetch('/api/promises', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (!response.ok) throw new Error('Ошибка удаления');
      // Убираем клиентское обновление - оставляем только серверное через триггеры
      // updatePosts({ id } as PromiseData, 'DELETE');
      console.log('✅ Promise deleted, waiting for server update via triggers');
    } catch (error) {
      setError('Ошибка при удалении обещания');
      console.error('Error:', error);
    }
  }; 

  const handleCompletePromise = async (
    id: string,
    result_content: string,
    result_media_url: string | null
  ) => {
    try {
      const response = await fetch('/api/promises', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          is_completed: true,
          result_content,
          result_media_url,
          completed_at: new Date().toISOString(),
        }),
      });
      if (!response.ok) throw new Error('Ошибка завершения обещания');
      const updated = await response.json();
      updatePosts(updated.promise, 'UPDATE');
      return updated.promise;
    } catch (error) {
      setError('Ошибка при завершении обещания');
      console.error(error);
      return null;
    }
  };

  return { handleDelete, handleUpdate, handleCreate, handleCompletePromise };
} 