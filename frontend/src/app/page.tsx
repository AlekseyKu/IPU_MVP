'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';

export default function Page() {
  const router = useRouter();
  const { telegramId, initData, setTelegramId, setInitData } = useUser();

  useEffect(() => {
    if (telegramId) {
      router.replace(`/user/${telegramId}`);
      return;
    }

    const extractUserId = (data: string): number | null => {
      try {
        const user = JSON.parse(decodeURIComponent(data.split('&user=')[1]?.split('&')[0] || ''));
        return user?.id ?? null;
      } catch {
        return null;
      }
    };

    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    let tgWebAppData = hashParams.get('tgWebAppData');

    if (!tgWebAppData && window.Telegram?.WebApp?.initData) {
      tgWebAppData = window.Telegram.WebApp.initData;
    }

    const id = tgWebAppData ? extractUserId(tgWebAppData) : null;
    if (id && tgWebAppData) {
      setTelegramId(id);
      setInitData(tgWebAppData);
      router.replace(`/user/${id}`);
    } else {
      console.warn('No telegramId found, redirecting to root');
      router.replace('/');
    }
  }, [telegramId, setTelegramId, setInitData, router]);

  return <div className="text-center p-5">Redirecting...</div>;
}
