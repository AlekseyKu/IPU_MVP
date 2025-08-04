// frontend\src\app\profile\[telegramId]\page.tsx
'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import { useUserProfileData } from '@/hooks/useUserProfileData';
import Header from '@/components/Header';
import Appfooter from '@/components/Appfooter';
import ProfilecardThree from '@/components/ProfilecardThree';
import Profiledetail from '@/components/Profiledetail';
import PromiseView from '@/components/PromiseView';
import Load from '@/components/Load';
import { AnimatePresence, motion } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';
import ChallengeView from '@/components/ChallengeView';


export default function ProfilePage() {
  const { telegramId: paramTelegramId } = useParams();
  const { telegramId: currentUserId } = useUser();
  const telegramId = Number(paramTelegramId);
  const isOwnProfile = currentUserId === telegramId;
  const [openPromiseId, setOpenPromiseId] = useState<string | null>(null);
  const [openChallengeId, setOpenChallengeId] = useState<string | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const { userData, promises, challenges, isSubscribed, isLoading, error, setUserData, setIsSubscribed, setError, recipients } = useUserProfileData(telegramId, currentUserId);

  const noop = () => {};
  
  const isEditable = isOwnProfile;
  const fullName = `${userData?.first_name || ''} ${userData?.last_name || ''}`.trim();

  const handleSubscribe = async () => {
    if (!currentUserId || isOwnProfile) return;

    try {
      const response = await fetch('/api/subscriptions', {
        method: isSubscribed ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ follower_id: currentUserId, followed_id: telegramId }),
      });

      if (!response.ok) throw new Error('Subscription error');

      const delta = isSubscribed ? -1 : 1;
      const current = userData?.subscribers || 0;

      setIsSubscribed(!isSubscribed);
      setUserData((prev) =>
        prev ? { ...prev, subscribers: Math.max(0, current + delta) } : prev
      );

      const { error: dbError } = await supabase
        .from('users')
        .update({ subscribers: Math.max(0, current + delta) })
        .eq('telegram_id', telegramId);

      if (dbError) throw dbError;
    } catch (err) {
      setError('Ошибка подписки');
    }
  };

  if (isLoading || !userData) return <Load />;

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
                  promises={promises.length}
                  promisesDone={promises.filter(p => p.is_completed).length}
                  karma_points={userData.karma_points || 0}
                  firstName={userData.first_name || ''}
                  lastName={userData.last_name || ''}
                  heroImgUrl={userData.hero_img_url || '/assets/images/ipu/hero-img.png'}
                  avatarUrl={userData.avatar_img_url || '/assets/images/ipu/avatar.png'}
                  isEditable={isEditable}
                  isOwnProfile={isOwnProfile}
                  onSubscribe={!isOwnProfile ? handleSubscribe : undefined}
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
                        firstName={userData.first_name || ''}
                        lastName={userData.last_name || ''}
                        about={userData.about || ''}
                        isEditable={isEditable}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <div className="col-xl-8 col-xxl-9 col-lg-8">
                <AnimatePresence>
                  {promises.filter(p => p.is_public).map((promise) => {
                    // --- Новый блок: получение данных о получателе для обещаний "кому-то" ---
                    let recipientName = '';
                    let recipientAvatarUrl = '';
                    if (promise.recipient_id) {
                      // Если получатель - это владелец профиля
                      if (promise.recipient_id === telegramId) {
                        recipientName = fullName;
                        recipientAvatarUrl = userData?.avatar_img_url || '/assets/images/defaultAvatar.png';
                      } else {
                        // Для других получателей используем загруженные данные
                        const recipient = recipients[promise.recipient_id];
                        if (recipient) {
                          recipientName = `${recipient.first_name} ${recipient.last_name}`.trim() || recipient.username || `@${promise.recipient_id}`;
                          recipientAvatarUrl = recipient.avatar_img_url || '/assets/images/defaultAvatar.png';
                        } else {
                          // Если данные еще не загружены, показываем ID
                          recipientName = `@${promise.recipient_id}`;
                          recipientAvatarUrl = '/assets/images/defaultAvatar.png';
                        }
                      }
                    }

                    return (
                      <motion.div
                        key={promise.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                      >
                        <PromiseView
                          promise={promise}
                          onToggle={() => setOpenPromiseId(openPromiseId === promise.id ? null : promise.id)}
                          isOpen={openPromiseId === promise.id}
                          onUpdate={noop}
                          onDelete={noop}
                          isOwnProfile={isOwnProfile}
                          recipientName={recipientName}
                          recipientAvatarUrl={recipientAvatarUrl}
                        />
                      </motion.div>
                    );
                  })}
                  {challenges.map((challenge) => (
                    <motion.div
                      key={challenge.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3, ease: 'easeOut' }}
                    >
                      <ChallengeView
                        challenge={challenge}
                        onToggle={() => setOpenChallengeId(openChallengeId === challenge.id ? null : challenge.id)}
                        isOpen={openChallengeId === challenge.id}
                        onUpdate={noop}
                        onDelete={noop}
                        isOwnProfile={isOwnProfile}
                        isProfilePage={true}
                      />
                    </motion.div>
                  ))}
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
