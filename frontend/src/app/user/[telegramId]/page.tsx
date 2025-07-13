'use client'
// frontend\src\app\user\[telegramId]\page.tsx

import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import { supabase } from '@/lib/supabaseClient';
import Header from '@/components/Header';
import Appfooter from '@/components/Appfooter';
import Postview from '@/components/Postview';
import ProfilecardThree from '@/components/ProfilecardThree';
import Profiledetail from '@/components/Profiledetail';
import Load from '@/components/Load';
import { AnimatePresence, motion } from 'framer-motion';
import { UserData, PromiseData } from '@/types';
import { useUserData } from '@/hooks/useUserData';
import usePromiseActions from '@/hooks/usePromiseActions';

export default function UserProfile() {
  const { telegramId: paramTelegramId } = useParams();
  const { telegramId: contextTelegramId, setTelegramId } = useUser();

  const telegramId = useMemo(
    () => Number(paramTelegramId) || contextTelegramId || 0,
    [paramTelegramId, contextTelegramId]
  );

  const [showProfileDetail, setShowProfileDetail] = useState(false);
  const [promises, setPromises] = useState<PromiseData[]>([]);
  const [openPromiseId, setOpenPromiseId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [localUserData, setLocalUserData] = useState<UserData | null>(null);

  const { userData, isLoading: userLoading, defaultHeroImg, defaultAvatarImg } = useUserData(telegramId);
  const isOwnProfile = contextTelegramId === telegramId;

  const { handleSubscribe, handleDelete, handleUpdate } = usePromiseActions(
    telegramId,
    setLocalUserData,
    setError
  );

  useEffect(() => {
    if (userData) setLocalUserData(userData);
  }, [userData]);

  useEffect(() => {
    async function fetchData() {
      if (!telegramId || isNaN(telegramId)) {
        setError('Invalid telegramId');
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setTelegramId(telegramId);

      try {
        const { data: promisesData, error: promisesError } = await supabase
          .from('promises')
          .select('*')
          .eq('user_id', telegramId)
          .order('created_at', { ascending: false });

        if (promisesError) throw promisesError;
        setPromises(promisesData || []);

        const { data: subscriptionData } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('follower_id', contextTelegramId)
          .eq('followed_id', telegramId);

        setIsSubscribed(!!subscriptionData?.length);
      } catch (error) {
        console.error(error);
        setError('General error occurred');
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [paramTelegramId, contextTelegramId]);

  useEffect(() => {
    if (!telegramId) return;

    const channel = supabase
      .channel(`promises-${telegramId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'promises' }, (payload) => {
        const updatedPromise = payload.new as PromiseData;

        if (payload.eventType === 'INSERT') {
          setPromises((prev) => [updatedPromise, ...prev]);
        } else if (payload.eventType === 'UPDATE') {
          setPromises((prev) => prev.map((p) => (p.id === updatedPromise.id ? updatedPromise : p)));
        } else if (payload.eventType === 'DELETE') {
          setPromises((prev) => prev.filter((p) => p.id !== payload.old.id));
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [telegramId]);

  if (isLoading || userLoading || !localUserData) {
    return <Load />;
  }

  const fullName = `${localUserData.first_name || ''} ${localUserData.last_name || ''}`.trim();
  const promisesCount = promises.length;
  const promisesDoneCount = promises.filter((p) => p.is_completed).length;

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
                  onToggleDetail={() => setShowProfileDetail((prev) => !prev)}
                  isOpen={showProfileDetail}
                  username={localUserData.username || ''}
                  firstName={localUserData.first_name || ''}
                  lastName={localUserData.last_name || ''}
                  telegramId={localUserData.telegram_id}
                  subscribers={localUserData.subscribers || 0}
                  promises={promisesCount}
                  promisesDone={promisesDoneCount}
                  stars={localUserData.stars || 0}
                  heroImgUrl={localUserData.hero_img_url || defaultHeroImg}
                  avatarUrl={localUserData.avatar_img_url || defaultAvatarImg}
                  isEditable={false}
                  isOwnProfile={isOwnProfile}
                  onSubscribe={handleSubscribe}
                  isSubscribed={isSubscribed}
                />
              </div>
              <div className="col-xl-4 col-xxl-3 col-lg-4">
                <AnimatePresence>
                  {showProfileDetail && (
                    <motion.div
                      initial={{ opacity: 0, y: 40 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 40 }}
                      transition={{ duration: 0.3, ease: 'easeOut' }}
                    >
                      <Profiledetail
                        username={localUserData.username || ''}
                        telegramId={localUserData.telegram_id}
                        fullName={fullName}
                        about={localUserData.about || ''}
                        isEditable={false}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <div className="col-xl-8 col-xxl-9 col-lg-8">
                <AnimatePresence>
                  {promises.map((promise) => (
                    <motion.div
                      key={promise.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3, ease: 'easeOut' }}
                    >
                      <Postview
                        promise={promise}
                        onToggle={() => setOpenPromiseId(openPromiseId === promise.id ? null : promise.id)}
                        isOpen={openPromiseId === promise.id}
                        onUpdate={handleUpdate}
                        onDelete={handleDelete}
                        isOwnProfile={isOwnProfile}
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
