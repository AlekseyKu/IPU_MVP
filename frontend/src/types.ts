// frontend/src/types.ts
export interface UserData {
  telegram_id: number;
  username: string | null;
  first_name: string | null;
  last_name: string | null;
  subscribers?: number;
  promises?: number;
  promises_done?: number;
  stars?: number;
  hero_img_url?: string;
  avatar_img_url?: string;
  about?: string;
  address?: string;
}

export interface User {
  telegram_id: number;
  first_name: string | null;
  last_name: string | null;
  username: string | null;
  avatar_img_url?: string;
}

export interface PostData {
  id: string;
  user_id: number;
  title: string;
  content: string;
  media_url?: string;
  created_at: string;
  is_public: boolean;
}

export interface PromiseData extends PostData {
  is_completed: boolean;
  deadline: string;
}

export interface ChallengeData extends PostData {
  frequency: 'daily' | 'weekly' | 'monthly';
  total_reports: number;
  completed_reports: number;
  is_completed: boolean;
}