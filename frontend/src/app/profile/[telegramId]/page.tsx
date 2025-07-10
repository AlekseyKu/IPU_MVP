// frontend/src/app/profile/[telegramId]/page.tsx
'use client'

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import Header from '@/components/Header';
import Appfooter from '@/components/Appfooter';
import ProfilecardThree from '@/components/ProfilecardThree';
import Profiledetail from '@/components/Profiledetail';
import Load from '@/components/Load';
import { UserData } from '@/types';

export default function ProfilePage() {
  const { telegramId: paramTelegramId } = useParams();
  const { telegramId: currentUserId } = useUser();
  const telegramId = Number(paramTelegramId); // Явное преобразование в число
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
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
        const [profileResponse, subscriptionResponse] = await Promise.all([
          fetch(`/api/users/${telegramId}`),
          fetch(`/api/subscriptions?follower_id=${currentUserId}&followed_id=${telegramId}`)
        ]);

        if (!profileResponse.ok) {
          throw new Error('User not found');
        }

        const profileData: UserData = await profileResponse.json();
        setUserData(profileData);

        const subscriptionData = await subscriptionResponse.json();
        setIsSubscribed(!!subscriptionData.length);

        setError(null);
      } catch (err: any) {
        setError(err.message || 'Error loading profile');
      } finally {
        setIsLoading(false);
      }
    }
    if (telegramId && currentUserId) {
      fetchUserData();
    }
  }, [telegramId, currentUserId]);

  const handleSubscribe = async (telegramId: number, isSubscribed: boolean) => {
    try {
      const response = await fetch('/api/subscriptions', {
        method: isSubscribed ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ follower_id: currentUserId, followed_id: telegramId })
      });

      if (!response.ok) {
        throw new Error('Subscription action failed');
      }

      setIsSubscribed(!isSubscribed);
      setUserData((prev) => prev ? {
        ...prev,
        subscribers: isSubscribed
          ? Math.max(0, (prev.subscribers || 0) - 1)
          : (prev.subscribers || 0) + 1
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
                  onToggleDetail={() => {}}
                  isOpen={true}
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
                  onSubscribe={handleSubscribe}
                  isSubscribed={isSubscribed}
                />
              </div>
              <div className="col-xl-4 col-xxl-3 col-lg-4">
                <Profiledetail
                  username={userData.username || ''}
                  telegramId={userData.telegram_id}
                  fullName={fullName}
                  about={userData.about || ''}
                  isEditable={isEditable}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Appfooter />
    </>
  );
}