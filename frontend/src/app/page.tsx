// frontend/src/app/page.tsx
'use client'

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';

export default function Page() {
  const router = useRouter();
  const { setTelegramId } = useUser();

  useEffect(() => {
    let telegramId: number | null = null;

    const urlParams = new URLSearchParams(window.location.hash.substring(1));
    const tgWebAppData = urlParams.get('tgWebAppData');
    if (tgWebAppData) {
      try {
        const decodedData = decodeURIComponent(tgWebAppData);
        const userDataFromWebApp = JSON.parse(decodedData.split('&user=')[1].split('&')[0]);
        if (userDataFromWebApp?.id) {
          telegramId = userDataFromWebApp.id;
          setTelegramId(telegramId);
          router.push(`/user/${telegramId}`);
        }
      } catch (error) {
        console.error('Parsing error:', error);
      }
    }

    if (telegramId === null) {
      console.error('No telegramId available');
      router.push('/error'); // Или другая страница при ошибке
    }
  }, [router, setTelegramId]);

  return <div className="text-center p-5">Redirecting...</div>;
}