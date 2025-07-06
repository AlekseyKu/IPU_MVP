// frontend/src/types.ts
export interface UserData {
  telegram_id: number;
  nickname: string | null;
  first_name: string | null;
  last_name: string | null;
  subscribers?: number;
  promises?: number;
  promises_done?: number;
  stars?: number;
  fullName?: string;
}

export interface User {
  telegram_id: number;
  first_name: string | null;
  last_name: string | null;
  nickname: string | null;
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