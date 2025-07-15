'use client'
// frontend\src\app\page.tsx

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import { supabase } from '@/lib/supabaseClient';

export default function Page() {
  const router = useRouter();
  const { telegramId, initData, setTelegramId, setInitData } = useUser();
  const [showWelcome, setShowWelcome] = useState(false);
  const [loading, setLoading] = useState(true);
  const [navigating, setNavigating] = useState(false);

  useEffect(() => {
    const extractUserId = (data: string): number | null => {
      try {
        const user = JSON.parse(decodeURIComponent(data.split('&user=')[1]?.split('&')[0] || ''));
        return user?.id ?? null;
      } catch {
        return null;
      }
    };

    const checkWelcomePageFlag = async (id: number) => {
      const { data, error } = await supabase
        .from('users')
        .select('hideWelcomePage')
        .eq('telegram_id', id)
        .single();

      if (error) {
        console.error('Supabase error:', error.message);
        router.replace('/');
        return;
      }

      if (data.hideWelcomePage) {
        router.replace(`/user/${id}`);
      } else {
        setShowWelcome(true);
        router.prefetch(`/user/${id}`);
      }

      setLoading(false);
    };

    if (telegramId) {
      checkWelcomePageFlag(telegramId);
      return;
    }

    const init = async () => {
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      let tgWebAppData = hashParams.get('tgWebAppData');

      if (!tgWebAppData && window.Telegram?.WebApp?.initData) {
        tgWebAppData = window.Telegram.WebApp.initData;
      }

      const id = tgWebAppData ? extractUserId(tgWebAppData) : null;
      if (id && tgWebAppData) {
        setTelegramId(id);
        setInitData(tgWebAppData);
        checkWelcomePageFlag(id);
      } else {
        console.warn('No telegramId found, redirecting to root');
        router.replace('/');
        setLoading(false);
      }
    };

    init();
  }, [telegramId, setTelegramId, setInitData, router]);

  const handleCheckboxChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!telegramId) return;

    const { error } = await supabase
      .from('users')
      .update({ hideWelcomePage: e.target.checked })
      .eq('telegram_id', telegramId);

    if (error) {
      console.error('Failed to update hideWelcomePage:', error.message);
    }
  };

  const handleContinue = () => {
    if (telegramId) {
      setNavigating(true);
      router.replace(`/user/${telegramId}`);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-white">
        <img
          src="/assets/images/ipu/logo_512.png"
          alt="IPU Logo"
          className="logo-loader"
        />
      </div>
    );
  }

  if (!showWelcome) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-white">
        <img
          src="/assets/images/ipu/logo_512.png"
          alt="IPU Logo"
          className="logo-loader"
        />
      </div>
    );
  }

  return (
    <div className="fade-in p-5 text-center">
      <h1 className="text-2xl font-bold mb-4">Добро пожаловать!</h1>
      <p className="mb-4">Это описание проекта. Можешь скрыть это приветствие 👇</p>
      <label>
        <input type="checkbox" onChange={handleCheckboxChange} />
        {' '}Больше не показывать
      </label>
      <div className="mt-4">
        <button
          onClick={handleContinue}
          className="btn btn-outline-primary px-4 py-2 rounded"
          disabled={navigating}
        >
          {navigating ? 'Переход...' : 'Продолжить'}
        </button>
      </div>
    </div>
  );
}
