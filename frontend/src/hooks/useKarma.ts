import { useState, useEffect, useCallback } from 'react';

interface KarmaTransaction {
  id: number;
  user_id: number;
  amount: number;
  reason: string;
  related_entity_type?: string;
  related_entity_id?: string;
  created_at: string;
}

interface KarmaStats {
  karma_points: number;
  recent_transactions: KarmaTransaction[];
}

export function useKarma(userId: number) {
  const [karmaHistory, setKarmaHistory] = useState<KarmaTransaction[]>([]);
  const [karmaStats, setKarmaStats] = useState<KarmaStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [currentOffset, setCurrentOffset] = useState(0);

  // Получение истории кармы
  const fetchKarmaHistory = useCallback(async (limit: number = 20, offset: number = 0, append: boolean = false) => {
    if (!userId || userId <= 0 || (isLoading && !append) || (isLoadingMore && append)) return;
    
    if (append) {
      setIsLoadingMore(true);
    } else {
      setIsLoading(true);
    }
    setError(null);
    
    try {
      const response = await fetch(`/api/karma/history?user_id=${userId}&limit=${limit}&offset=${offset}`);
      if (!response.ok) {
        throw new Error('Failed to fetch karma history');
      }
      
      const data = await response.json();
      
      if (append) {
        setKarmaHistory(prev => [...prev, ...data]);
        setHasMore(data.length === limit);
        setCurrentOffset(offset + data.length);
      } else {
        setKarmaHistory(data);
        setHasMore(data.length === limit);
        setCurrentOffset(data.length);
      }
    } catch (err) {
      console.error('Error fetching karma history:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      if (append) {
        setIsLoadingMore(false);
      } else {
        setIsLoading(false);
      }
    }
  }, [userId, isLoading, isLoadingMore]);

  // Получение статистики кармы
  const fetchKarmaStats = useCallback(async () => {
    if (!userId || userId <= 0 || isLoading) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/karma/stats?user_id=${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch karma stats');
      }
      
      const data = await response.json();
      setKarmaStats(data);
    } catch (err) {
      console.error('Error fetching karma stats:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }, [userId, isLoading]);

  // Сброс состояния при изменении userId
  useEffect(() => {
    if (userId && userId > 0) {
      setIsInitialized(false);
      setKarmaHistory([]);
      setKarmaStats(null);
      setError(null);
    }
  }, [userId]);

  // Загрузка данных при изменении userId
  useEffect(() => {
    if (userId && userId > 0 && !isInitialized) {
      // Добавляем небольшую задержку для предотвращения дублирования в React Strict Mode
      const timer = setTimeout(() => {
        setIsInitialized(true);
        fetchKarmaStats();
        fetchKarmaHistory();
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [userId, isInitialized, fetchKarmaStats, fetchKarmaHistory]);

  // Обновление данных
  const refreshData = useCallback(() => {
    if (userId) {
      fetchKarmaStats();
      fetchKarmaHistory();
    }
  }, [userId, fetchKarmaStats, fetchKarmaHistory]);

  // Загрузка дополнительных записей
  const loadMore = useCallback(() => {
    if (userId && hasMore && !isLoadingMore) {
      fetchKarmaHistory(20, currentOffset, true);
    }
  }, [userId, hasMore, isLoadingMore, currentOffset, fetchKarmaHistory]);

  return {
    karmaHistory,
    karmaStats,
    isLoading,
    isLoadingMore,
    error,
    hasMore,
    refreshData,
    loadMore,
    fetchKarmaHistory,
    fetchKarmaStats
  };
} 