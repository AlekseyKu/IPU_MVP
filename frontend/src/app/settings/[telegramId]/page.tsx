// frontend/src/app/settings/[telegramId]/page.tsx
'use client'

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import { useUserData } from '@/hooks/useUserData';
import { createClient } from '@supabase/supabase-js';
import Header from '@/components/Header';
import Appfooter from '@/components/Appfooter';
import ProfilecardThree from '@/components/ProfilecardThree';
import Profiledetail from '@/components/Profiledetail';
import { UserData } from '@/types';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function SettingsPage() {
  const { telegramId: paramTelegramId } = useParams();
  const { telegramId: contextTelegramId } = useUser();
  const telegramId = parseInt(paramTelegramId as string, 10) || contextTelegramId || 0;
  const { userData, isLoading, defaultHeroImg, defaultAvatarImg } = useUserData(telegramId);
  const [heroImg, setHeroImg] = useState(userData?.hero_img_url || defaultHeroImg);
  const [avatar, setAvatar] = useState(userData?.avatar_url || defaultAvatarImg);
  const [firstName, setFirstName] = useState(userData?.first_name || '');
  const [lastName, setLastName] = useState(userData?.last_name || '');
  const [about, setAbout] = useState(userData?.about || '');
  const [address, setAddress] = useState(userData?.address || '');

  const handleImageUpload = async (type: 'hero' | 'avatar', event: React.MouseEvent) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e: Event) => {
      const fileInput = e.target as HTMLInputElement;
      const file = fileInput.files?.[0];
      if (!file || !telegramId) return;

      const fileName = `${telegramId}/${type}/${Date.now()}_${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from('user-images')
        .upload(fileName, file, { upsert: true });
      if (uploadError) {
        console.error(`Error uploading ${type} image:`, uploadError.message);
        return;
      }

      const { data: urlData } = supabase.storage
        .from('user-images')
        .getPublicUrl(fileName);
      const publicUrl = urlData.publicUrl;

      if (type === 'hero') {
        setHeroImg(publicUrl);
      } else if (type === 'avatar') {
        setAvatar(publicUrl);
      }
    };
    input.click();
  };

  const handleSave = async () => {
    if (!telegramId || !userData) return;

    console.log('Saving user data:', { first_name: firstName, last_name: lastName, about, address }); // Отладка
    const { error } = await supabase
      .from('users')
      .update({
        first_name: firstName,
        last_name: lastName,
        hero_img_url: heroImg,
        avatar_url: avatar,
        about,
        address,
      })
      .eq('telegram_id', telegramId);
    if (error) {
      console.error('Error updating user data:', error.message);
    } else {
      console.log('User data updated successfully'); // Отладка
    }
  };

  if (isLoading) {
    return <div className="text-center p-5">Loading...</div>;
  }

  const fullName = `${userData?.first_name || ''} ${userData?.last_name || ''}`.trim() || 'Guest';

  return (
    <>
      <Header />
      <div className="main-content">
        <div className="middle-sidebar-bottom">
          <div className="middle-sidebar-left pe-0">
            <div className="row">
              <div className="col-xl-12 mb-3">
                <ProfilecardThree
                  onToggleDetail={() => {}} // Блокируем переключение, так как всегда развернуто
                  isOpen={true} // Всегда развернуто
                  nickname={userData?.nickname || 'Guest'}
                  telegramId={userData?.telegram_id || 0}
                  subscribers={userData?.subscribers || 0}
                  promises={userData?.promises || 0}
                  promisesDone={userData?.promises_done || 0}
                  stars={userData?.stars || 0}
                  fullName={fullName}
                  heroImgUrl={heroImg}
                  avatarUrl={avatar}
                  onChangeHeroImg={(url) => setHeroImg(url)}
                  onChangeAvatar={(url) => setAvatar(url)}
                  onChangeFullName={(fn, ln) => { setFirstName(fn); setLastName(ln); }}
                  isEditable={true} // Разрешаем редактирование
                  onHeroClick={handleImageUpload.bind(null, 'hero')}
                  onAvatarClick={handleImageUpload.bind(null, 'avatar')}
                />
              </div>
              <div className="col-xl-4 col-xxl-3 col-lg-4">
                <Profiledetail
                  nickname={userData?.nickname || 'Guest'}
                  telegramId={userData?.telegram_id || 0}
                  fullName={fullName}
                  about={userData?.about}
                  address={userData?.address}
                  onChangeAbout={(text) => setAbout(text)}
                  onChangeAddress={(text) => setAddress(text)}
                  onChangeFullName={(fn, ln) => { setFirstName(fn); setLastName(ln); }}
                  isEditable={true} // Разрешаем редактирование
                />
              </div>
            </div>
          </div>
        </div>
        <div className="text-center mt-0">
          <button
            onClick={handleSave}
            className="btn btn-primary"
          >
            Сохранить
          </button>
        </div>
      </div>
      <Appfooter />
    </>
  );
}