'use client';

import { useState, useEffect, useRef } from 'react';
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

  const [heroImg, setHeroImg] = useState<string>(defaultHeroImg);
  const [avatar, setAvatar] = useState<string>(defaultAvatarImg);
  const [error, setError] = useState<string | null>(null);
  const [isSavingImage, setIsSavingImage] = useState(false);
  const [isSavingText, setIsSavingText] = useState(false);
  const [firstName, setFirstName] = useState(userData?.first_name || '');
  const [lastName, setLastName] = useState(userData?.last_name || '');
  const [about, setAbout] = useState(userData?.about || '');
  const [isDirty, setIsDirty] = useState(false);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [viewportHeight, setViewportHeight] = useState<number>(typeof window !== 'undefined' ? window.innerHeight : 0);

  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (userData) {
      setHeroImg(userData.hero_img_url || defaultHeroImg);
      setAvatar(userData.avatar_img_url || defaultAvatarImg);
      setFirstName(userData.first_name || '');
      setLastName(userData.last_name || '');
      setAbout(userData.about || '');
    }
  }, [userData, defaultHeroImg, defaultAvatarImg]);

  useEffect(() => {
    const hasChanges =
      firstName !== (userData?.first_name || '') ||
      lastName !== (userData?.last_name || '') ||
      about !== (userData?.about || '');
    setIsDirty(hasChanges);
  }, [firstName, lastName, about, userData]);

  useEffect(() => {
    const updateHeight = () => {
      setViewportHeight(window.innerHeight);
      const heightDiff = window.innerHeight < screen.height ? screen.height - window.innerHeight : 0;
      setIsKeyboardOpen(heightDiff > 150);
    };

    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

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

      const formData = new FormData();
      formData.append('file', file);
      formData.append('initData', effectiveInitData);
      formData.append('file_type', type);

      setIsSavingImage(true);

      try {
        const response = await fetch(`/api/users/${telegramId}/upload`, {
          method: 'POST',
          body: formData,
        });

        const { url } = await response.json();

        if (!response.ok) {
          setError(`Error uploading ${type} image`);
          return;
        }

        if (type === 'hero') {
          setHeroImg(url);
        } else {
          setAvatar(url);
        }

        setError(null);
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        setError(`Error uploading ${type} image: ${errorMessage}`);
      } finally {
        setIsSavingImage(false);
      }
    };
    input.click();
  };

  const handleSaveProfile = async () => {
    if (!telegramId) {
      setError('No telegramId available');
      return;
    }

    setIsSavingText(true);
    try {
      const response = await fetch(`/api/users/${telegramId}/update`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ first_name: firstName, last_name: lastName, about }),
      });

      if (!response.ok) {
        const { detail } = await response.json();
        setError(detail || 'Error saving profile');
        return;
      }

      setError(null);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setError(`Error saving profile: ${errorMessage}`);
    } finally {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setIsSavingText(false);
    }
  };

  if (isLoading || !userData) {
    return <Load />;
  }

  const fullName = `${firstName || ''} ${lastName || ''}`.trim() || '';

  return (
    <>
      <Header />
      <div
        className="main-content"
        ref={contentRef}
        style={{
          height: viewportHeight - (isKeyboardOpen ? 0 : 56),
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {error && <div className="alert alert-danger">{error}</div>}
        <div className="middle-sidebar-bottom">
          <div className="middle-sidebar-left pe-0">
            <div className="row">
              <div className="col-xl-12 mb-3">
                <ProfilecardThree
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
                  isSavingImage={isSavingImage}
                  isSavingText={isSavingText}
                  isDirty={isDirty}
                  onHeroClick={handleImageUpload.bind(null, 'hero')}
                  onAvatarClick={handleImageUpload.bind(null, 'avatar')}
                  onChangeFullName={(first, last) => {
                    setFirstName(first);
                    setLastName(last);
                  }}
                  onSaveClick={handleSaveProfile}
                />
              </div>
              <div className="col-xl-4 col-xxl-3 col-lg-4">
                <Profiledetail
                  username={userData.username || ''}
                  telegramId={userData.telegram_id}
                  fullName={fullName}
                  about={about}
                  isEditable={true}
                  isSavingImage={isSavingImage}
                  onChangeAbout={(text) => setAbout(text)}
                  onChangeFullName={(first, last) => {
                    setFirstName(first);
                    setLastName(last);
                  }}
                  scrollContainerRef={contentRef}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {!isKeyboardOpen && <Appfooter />}
    </>
  );
}
