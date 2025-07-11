// frontend/src/app/profile/[telegramId]/page.tsx
'use client'

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import { createClient } from '@supabase/supabase-js'; // Импорт Supabase клиента
import Header from '@/components/Header';
import Appfooter from '@/components/Appfooter';
import ProfilecardThree from '@/components/ProfilecardThree';
import Profiledetail from '@/components/Profiledetail';
import Load from '@/components/Load';
import { AnimatePresence, motion } from 'framer-motion'; // Импорт для анимации
import { UserData } from '@/types';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ProfilePage() {
  const { telegramId: paramTelegramId } = useParams();
  const { telegramId: currentUserId } = useUser() || {}; // Обработка случая, если useUser() вернёт undefined
  const telegramId = Number(paramTelegramId); // Явное преобразование в число
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false); // Локальное состояние для деталей
  const isEditable = currentUserId === telegramId;
  const isOwnProfile = currentUserId === telegramId;

  // Отладочный лог для проверки
  useEffect(() => {
    console.log('ProfilePage: currentUserId=', currentUserId, 'telegramId=', telegramId, 'isOwnProfile=', isOwnProfile);
  }, [currentUserId, telegramId]);

  useEffect(() => {
    async function fetchUserData() {
      if (!telegramId || isNaN(telegramId)) {
        setError('Invalid telegramId');
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const profileResponse = await fetch(`/api/users/${telegramId}`);

        if (!profileResponse.ok) {
          throw new Error('User not found');
        }

        const profileData: UserData = await profileResponse.json();
        setUserData(profileData);

        // Загрузка статуса подписки только если пользователь авторизован
        if (currentUserId) {
          const subscriptionResponse = await fetch(`/api/subscriptions?follower_id=${currentUserId}&followed_id=${telegramId}`);
          const subscriptionData = await subscriptionResponse.json();
          setIsSubscribed(!!subscriptionData.length);
        }

        setError(null);
      } catch (err: any) {
        setError(err.message || 'Error loading profile');
      } finally {
        setIsLoading(false);
      }
    }

    if (telegramId) {
      fetchUserData();
    }
  }, [telegramId, currentUserId]);

  const handleSubscribe = async (telegramId: number, isSubscribed: boolean) => {
    if (!currentUserId) {
      setError('User not authenticated');
      throw new Error('User not authenticated');
    }

    try {
      const response = await fetch('/api/subscriptions', {
        method: isSubscribed ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ follower_id: currentUserId, followed_id: telegramId })
      });

      if (!response.ok) {
        throw new Error('Subscription action failed');
      }

      // Обновление статуса подписки
      setIsSubscribed(!isSubscribed);

      // Обновление поля subscribers в таблице users
      const updateSubscribers = isSubscribed ? -1 : 1;
      const currentSubscribers = userData?.subscribers ?? 0; // Безопасное получение значения
      const { error: updateError } = await supabase
        .from('users')
        .update({ subscribers: currentSubscribers + updateSubscribers })
        .eq('telegram_id', telegramId);

      if (updateError) {
        throw new Error('Failed to update subscribers count');
      }

      // Обновление локального состояния
      setUserData((prev) => prev ? {
        ...prev,
        subscribers: isSubscribed
          ? Math.max(0, (prev.subscribers ?? 0) - 1)
          : (prev.subscribers ?? 0) + 1
      } : prev);
    } catch (error) {
      setError('Error updating subscription');
      throw error;
    }
  };

  if (isLoading || !userData) {
    return <Load />;
  }

  const fullName = `${userData.first_name || ''} ${userData.last_name || ''}`.trim() || '';

  return (
    <>
      <Header />
      <div className="main-content">
        {error && <div className="alert alert-danger">{error}</div>}
        <div className="middle-sidebar-bottom">
          <div className="middle-sidebar-left pe-0">
            <div className="row">
              <div className="col-xl-12 mb-3">
                <ProfilecardThree
                  onToggleDetail={() => setIsDetailOpen((prev) => !prev)}
                  isOpen={isDetailOpen}
                  username={userData.username || ''}
                  telegramId={userData.telegram_id}
                  subscribers={userData.subscribers || 0}
                  promises={userData.promises || 0}
                  promisesDone={userData.promises_done || 0}
                  stars={userData.stars || 0}
                  fullName={fullName}
                  heroImgUrl={userData.hero_img_url || '/assets/images/ipu/hero-img.png'}
                  avatarUrl={userData.avatar_img_url || '/assets/images/ipu/avatar.png'}
                  isEditable={isEditable}
                  isOwnProfile={isOwnProfile}
                  onSubscribe={currentUserId ? handleSubscribe : undefined}
                  isSubscribed={isSubscribed}
                />
              </div>
              <div className="col-xl-4 col-xxl-3 col-lg-4">
                <AnimatePresence>
                  {isDetailOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 40 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 40 }}
                      transition={{ duration: 0.3, ease: 'easeOut' }}
                    >
                      <Profiledetail
                        username={userData.username || ''}
                        telegramId={userData.telegram_id}
                        fullName={fullName}
                        about={userData.about || ''}
                        isEditable={isEditable}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Appfooter />
    </>
  );
}