'use client'
// frontend\src\app\page.tsx

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import { supabase } from '@/lib/supabaseClient';
import Onboarding from '@/components/Onboarding';

export default function Page() {
  const router = useRouter();
  const { telegramId, initData, setTelegramId, setInitData } = useUser();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [loading, setLoading] = useState(true);

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
        setShowOnboarding(true);
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

  const handleOnboardingComplete = () => {
    if (telegramId) {
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

  if (!showOnboarding) {
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

  return <Onboarding onComplete={handleOnboardingComplete} />;
}
