// frontend/src/app/page.tsx
'use client'

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';

export default function Page() {
  const router = useRouter();
  const { setTelegramId, setInitData } = useUser();

  useEffect(() => {
    let telegramId: number | null = null;
    let initData: string | null = null;

    const urlParams = new URLSearchParams(window.location.hash.substring(1));
    const tgWebAppData = urlParams.get('tgWebAppData');
    console.log('tgWebAppData from URL:', tgWebAppData); // Логирование

    if (tgWebAppData) {
      try {
        initData = decodeURIComponent(tgWebAppData);
        console.log('Decoded initData:', initData); // Логирование
        const userDataFromWebApp = JSON.parse(initData.split('&user=')[1].split('&')[0]);
        if (userDataFromWebApp?.id) {
          telegramId = userDataFromWebApp.id;
          setTelegramId(telegramId);
          setInitData(initData);
          console.log('Saved telegramId:', telegramId, 'initData:', initData); // Логирование
          router.push(`/user/${telegramId}`);
        }
      } catch (error) {
        console.error('Parsing error:', error);
      }
    } else {
      console.error('No tgWebAppData in URL');
      initData = window.Telegram?.WebApp?.initData || null;
      if (initData) {
        console.log('Fallback initData from Telegram:', initData); // Логирование
        try {
          const userDataFromWebApp = JSON.parse(initData.split('&user=')[1].split('&')[0]);
          if (userDataFromWebApp?.id) {
            telegramId = userDataFromWebApp.id;
            setTelegramId(telegramId);
            setInitData(initData);
            router.push(`/user/${telegramId}`);
          }
        } catch (error) {
          console.error('Fallback parsing error:', error);
        }
      }
    }

    if (telegramId === null) {
      console.error('No telegramId available');
      // router.push('/error');
      router.push('/');
    }
  }, [router, setTelegramId, setInitData]);

  return <div className="text-center p-5">Redirecting...</div>;
}