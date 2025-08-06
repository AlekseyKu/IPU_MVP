// frontend/src/hooks/useLeaders.ts
import { useState, useEffect } from 'react';

export interface LeaderData {
  telegram_id: number;
  first_name: string | null;
  last_name: string | null;
  username: string | null;
  avatar_img_url: string;
  karma_points: number;
  subscribers: number;
  promises: number;
  promises_done: number;
  challenges: number;
  challenges_done: number;
  rank: number;
  display_name: string;
}

export type PeriodType = 'day' | 'week' | 'all';

export function useLeaders() {
  const [leaders, setLeaders] = useState<LeaderData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState<PeriodType>('all');

  const fetchLeaders = async (selectedPeriod: PeriodType) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/leaders?period=${selectedPeriod}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch leaders');
      }

      const data: LeaderData[] = await response.json();
      setLeaders(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  const changePeriod = (newPeriod: PeriodType) => {
    setPeriod(newPeriod);
    fetchLeaders(newPeriod);
  };

  useEffect(() => {
    fetchLeaders(period);
  }, []);

  return {
    leaders,
    isLoading,
    error,
    period,
    changePeriod
  };
} 