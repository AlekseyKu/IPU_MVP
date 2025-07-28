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
  is_completed: boolean;
  hashtags?: string[];
}

export interface PromiseData extends PostData {
  deadline: string;
  result_content?: string;      // завершение - текст
  result_media_url?: string; // завершение - медиа
  completed_at?: string;     // завершение - дата
  // --- Новые поля для обещаний "кому-то" ---
  requires_accept?: boolean;
  recipient_id?: number;
  is_accepted?: boolean | null;
  is_completed_by_creator?: boolean | null;
  is_completed_by_recipient?: boolean | null;
}

export interface ChallengeData extends PostData {
  frequency: 'daily' | 'weekly' | 'monthly';
  total_reports: number;
  completed_reports: number;
  start_at?: string;           // Добавлено, nullable
  report_periods?: string[];   // Добавлено, массив строк вроде ["2025-01-01/2025-01-07"]
  deadline_period?: string;    // Добавлено, строка вроде "2025-01-21/2025-01-21"
}