// frontend/src/types/telegram.d.ts
export {}

declare global {
  interface TelegramUser {
    id: number;
    first_name: string;
    last_name?: string;
    username?: string;
    photo_url?: string;
  }

  interface TelegramInitDataUnsafe {
    user?: TelegramUser;
    // Дополнительные поля initDataUnsafe можно добавить по мере необходимости
  }

  interface TelegramWebApp {
    ready: () => void;
    expand: () => void;
    close: () => void;
    initData: string;
    initDataUnsafe: TelegramInitDataUnsafe;
    onEvent: (eventType: string, callback: (...args: any[]) => void) => void;
    offEvent: (eventType: string, callback: (...args: any[]) => void) => void;
    sendData: (data: string) => void;
    themeParams: Record<string, string>;
    isExpanded?: boolean;
    isFullscreen?: boolean;
    requestFullscreen?: () => void;
    exitFullscreen?: () => void;
    BackButton: {
      show: () => void;
      hide: () => void;
      onClick: (cb: () => void) => void;
    };
  }

  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp;
    };
  }
}