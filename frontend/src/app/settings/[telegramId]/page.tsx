// frontend/src/app/settings/[telegramId]/page.tsx
'use client'

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import { useUserData } from '@/hooks/useUserData';
import Header from '@/components/Header';
import Appfooter from '@/components/Appfooter';
import ProfilecardThree from '@/components/ProfilecardThree';
import Profiledetail from '@/components/Profiledetail';
import Load from '@/components/Load';
import { UserData } from '@/types';

export default function SettingsPage() {
  const { telegramId: paramTelegramId } = useParams();
  const { telegramId: contextTelegramId, initData } = useUser();
  const telegramId = parseInt(paramTelegramId as string, 10) || contextTelegramId || 0;
  const { userData, isLoading, defaultHeroImg, defaultAvatarImg } = useUserData(telegramId);
  const [heroImg, setHeroImg] = useState(userData?.hero_img_url || defaultHeroImg);
  const [avatar, setAvatar] = useState(userData?.avatar_url || defaultAvatarImg);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('initData in SettingsPage:', initData); // Логирование
    if (userData) {
      setHeroImg(userData.hero_img_url || defaultHeroImg);
      setAvatar(userData.avatar_url || defaultAvatarImg);
    }
  }, [userData, defaultHeroImg, defaultAvatarImg, initData]);

  const handleImageUpload = async (type: 'hero' | 'avatar', event: React.MouseEvent) => {
    if (!telegramId || !userData) {
      setError('No telegramId or userData available');
      return;
    }

    const effectiveInitData = initData || window.Telegram?.WebApp?.initData || '';
    if (!effectiveInitData) {
      setError('No initData available');
      return;
    }

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/png,image/jpeg';
    input.onchange = async (e: Event) => {
      const fileInput = e.target as HTMLInputElement;
      const file = fileInput.files?.[0];
      if (!file) {
        setError('No file selected');
        return;
      }

      console.log('Sending initData:', effectiveInitData); // Логирование

      const formData = new FormData();
      formData.append('file', file);
      formData.append('initData', effectiveInitData);
      formData.append('file_type', type);

      try {
        const response = await fetch(`/api/users/${telegramId}/upload`, {
          method: 'POST',
          body: formData,
        });
        if (!response.ok) {
          const errorData = await response.json();
          setError(`Error uploading ${type} image: ${errorData.detail || 'Unknown error'}`);
          console.error('Error response:', errorData);
          return;
        }

        const { url } = await response.json();
        if (type === 'hero') {
          setHeroImg(url);
        } else {
          setAvatar(url);
        }
        setError(null);
        console.log(`${type} image uploaded and saved:`, url);
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        setError(`General error uploading ${type} image: ${errorMessage}`);
        console.error(`Error uploading ${type} image:`, error);
      }
    };
    input.click();
  };

  if (isLoading || !userData) {
    return <Load />;
  }

  const fullName = `${userData.first_name || ''} ${userData.last_name || ''}`.trim() || 'Не указано';

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
                  onToggleDetail={() => {}} // Блокируем переключение
                  isOpen={true} // Всегда развернуто
                  username={userData.username || ''}
                  telegramId={userData.telegram_id}
                  subscribers={userData.subscribers || 0}
                  promises={userData.promises || 0}
                  promisesDone={userData.promises_done || 0}
                  stars={userData.stars || 0}
                  fullName={fullName}
                  heroImgUrl={heroImg}
                  avatarUrl={avatar}
                  isEditable={true}
                  onHeroClick={handleImageUpload.bind(null, 'hero')}
                  onAvatarClick={handleImageUpload.bind(null, 'avatar')}
                />
              </div>
              <div className="col-xl-4 col-xxl-3 col-lg-4">
                <Profiledetail
                  username={userData.username || ''}
                  telegramId={userData.telegram_id}
                  fullName={fullName}
                  about={userData.about || ''}
                  isEditable={true}
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