// frontend/src/hooks/useLikes.ts
import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useUser } from '@/context/UserContext';

export interface LikeData {
  id: string;
  user_id: number;
  post_id: string;
  post_type: 'promise' | 'challenge';
  created_at: string;
}

export interface PostLikeData {
  likes_count: number;
  is_liked_by_user: boolean;
}

export function useLikes(postId: string, postType: 'promise' | 'challenge') {
  const { telegramId } = useUser();
  const [likesCount, setLikesCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isFetching = useRef(false);

  // Загрузка данных о лайках
  const fetchLikesData = useCallback(async () => {
    if (!postId || !postType || isFetching.current) return;

    isFetching.current = true;

    try {
      const response = await fetch(
        `/api/likes?post_id=${postId}&post_type=${postType}&user_id=${telegramId || ''}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch likes data');
      }

      const data: PostLikeData = await response.json();
      setLikesCount(data.likes_count);
      setIsLiked(data.is_liked_by_user);
      setError(null);
    } catch (err) {
      console.error('Error fetching likes data:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      isFetching.current = false;
    }
  }, [postId, postType, telegramId]);

  // Поставить лайк
  const likePost = useCallback(async () => {
    if (!telegramId || !postId || !postType) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/likes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          post_id: postId,
          post_type: postType,
          user_id: telegramId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to like post');
      }

      // Обновляем локальное состояние
      setLikesCount(prev => prev + 1);
      setIsLiked(true);
      setError(null);
    } catch (err) {
      console.error('Error liking post:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }, [telegramId, postId, postType]);

  // Убрать лайк
  const unlikePost = useCallback(async () => {
    if (!telegramId || !postId || !postType) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/likes', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          post_id: postId,
          post_type: postType,
          user_id: telegramId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to unlike post');
      }

      // Обновляем локальное состояние
      setLikesCount(prev => Math.max(0, prev - 1));
      setIsLiked(false);
      setError(null);
    } catch (err) {
      console.error('Error unliking post:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }, [telegramId, postId, postType]);

  // Переключить лайк
  const toggleLike = useCallback(async () => {
    if (isLiked) {
      await unlikePost();
    } else {
      await likePost();
    }
  }, [isLiked, likePost, unlikePost]);

  // Загружаем данные при монтировании и при изменении зависимостей
  useEffect(() => {
    fetchLikesData();
  }, [fetchLikesData]);

  // Подписка на real-time обновления лайков
  useEffect(() => {
    if (!postId || !postType) return;

    const channel = supabase
      .channel(`likes-${postId}-${postType}`)
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'likes',
          filter: `post_id=eq.${postId} AND post_type=eq.${postType}`
        }, 
        (payload) => {
          console.log('Likes real-time update:', payload);
          
          // Обновляем данные при изменениях
          fetchLikesData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [postId, postType, fetchLikesData]);

  return {
    likesCount,
    isLiked,
    isLoading,
    error,
    likePost,
    unlikePost,
    toggleLike,
    refetch: fetchLikesData,
  };
} 