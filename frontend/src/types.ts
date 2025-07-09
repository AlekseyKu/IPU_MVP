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
}

export interface PromiseData {
  id: string;
  user_id: number;
  title: string;
  deadline: string;
  content: string;
  media_url?: string;
  is_completed: boolean;
  created_at: string;
}