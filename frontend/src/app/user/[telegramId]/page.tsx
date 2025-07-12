// frontend/src/app/user/[telegramId]/page.tsx
'use client'

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import { useUserData } from '@/hooks/useUserData';
import Header from '@/components/Header';
import Leftnav from '@/components/Leftnav';
import Appfooter from '@/components/Appfooter';
import Postview from '@/components/Postview';
import ProfilecardThree from '@/components/ProfilecardThree';
import Profiledetail from '@/components/Profiledetail';
import Load from '@/components/Load';
import { AnimatePresence, motion } from 'framer-motion';
import { UserData, PromiseData } from '@/types';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function UserProfile() {
  const { telegramId: paramTelegramId } = useParams();
  const { telegramId: contextTelegramId, setTelegramId } = useUser();
  const [showProfileDetail, setShowProfileDetail] = useState(false);
  const [promises, setPromises] = useState<PromiseData[]>([]);
  const [openPromiseId, setOpenPromiseId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [localUserData, setLocalUserData] = useState<UserData | null>(null);

  const telegramId = Number(paramTelegramId) || contextTelegramId || 0;
  const { userData, isLoading: userLoading, defaultHeroImg, defaultAvatarImg } = useUserData(telegramId);
  const isOwnProfile = contextTelegramId === telegramId;

  useEffect(() => {
    console.log('UserProfile: contextTelegramId=', contextTelegramId, 'telegramId=', telegramId, 'isOwnProfile=', isOwnProfile);
  }, [contextTelegramId, telegramId]);

  useEffect(() => {
    if (userData) {
      setLocalUserData(userData);
    }
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

      console.time('Total fetch time');
      try {
        console.time('Supabase query - promises');
        const { data: promisesData, error: promisesError } = await supabase
          .from('promises')
          .select('*')
          .eq('user_id', telegramId)
          .order('created_at', { ascending: false });
        console.timeEnd('Supabase query - promises');
        if (promisesError) {
          console.error('Error fetching promises:', promisesError.message);
          setError('Error fetching promises');
        } else {
          setPromises(promisesData || []);
        }

        console.time('Supabase query - subscription');
        const { data: subscriptionData } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('follower_id', contextTelegramId)
          .eq('followed_id', telegramId);
        console.timeEnd('Supabase query - subscription');
        setIsSubscribed(!!subscriptionData?.length);
      } catch (error) {
        console.error('General error:', error);
        setError('General error occurred');
      } finally {
        setIsLoading(false);
        console.timeEnd('Total fetch time');
      }
    }

    if (telegramId) {
      fetchData();
    }
  }, [paramTelegramId, contextTelegramId, telegramId, setTelegramId]);

  // Подписка на изменения таблицы promises в реальном времени
  useEffect(() => {
    if (!telegramId) return;

    const channel = supabase
      .channel(`promises-${telegramId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'promises',
        filter: `user_id=eq.${telegramId}`,
      }, (payload) => {
        const newPromise = payload.new as PromiseData;
        setPromises((prev) => [...prev, newPromise].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
      })
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'promises',
        filter: `user_id=eq.${telegramId}`,
      }, (payload) => {
        const updatedPromise = payload.new as PromiseData;
        setPromises((prev) =>
          prev.map((p) => (p.id === updatedPromise.id ? updatedPromise : p))
        );
      })
      .on('postgres_changes', {
        event: 'DELETE',
        schema: 'public',
        table: 'promises',
        filter: `user_id=eq.${telegramId}`,
      }, (payload) => {
        const deletedId = payload.old.id as string;
        setPromises((prev) => prev.filter((p) => p.id !== deletedId));
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [telegramId]);

  const handleSubscribe = async (telegramId: number, isSubscribed: boolean) => {
    try {
      const response = await fetch('/api/subscriptions', {
        method: isSubscribed ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ follower_id: contextTelegramId, followed_id: telegramId }),
      });

      if (!response.ok) {
        throw new Error('Subscription action failed');
      }

      setIsSubscribed(!isSubscribed);
      setLocalUserData((prev) =>
        prev
          ? {
              ...prev,
              subscribers: isSubscribed
                ? Math.max(0, (prev.subscribers ?? 0) - 1)
                : (prev.subscribers ?? 0) + 1,
            }
          : prev
      );
    } catch (error) {
      setError('Error updating subscription');
      throw error;
    }
  };

  const handleDelete = async (id: string) => {
    setPromises((prev) => prev.filter((p) => p.id !== id));

    try {
      const currentPromises = localUserData?.promises ?? 0;
      const { error: updateError } = await supabase
        .from('users')
        .update({ promises: Math.max(0, currentPromises - 1) })
        .eq('telegram_id', telegramId);

      if (updateError) {
        throw new Error('Failed to update promises count');
      }

      setLocalUserData((prev) =>
        prev ? { ...prev, promises: Math.max(0, (prev.promises ?? 0) - 1) } : prev
      );
    } catch (error) {
      setError('Error updating promises in DB');
      console.error('Error:', error);
    }
  };

  const handleUpdate = async (updatedPromise: PromiseData) => {
    setPromises((prev) =>
      prev.map((p) => (p.id === updatedPromise.id ? updatedPromise : p))
    );

    try {
      const currentPromisesDone = localUserData?.promises_done ?? 0;
      const wasCompleted = promises.find((p) => p.id === updatedPromise.id)?.is_completed ?? false;
      const updateDone = wasCompleted !== updatedPromise.is_completed
        ? (updatedPromise.is_completed ? 1 : -1)
        : 0;

      const { error: updateError } = await supabase
        .from('users')
        .update({ promises_done: Math.max(0, currentPromisesDone + updateDone) })
        .eq('telegram_id', telegramId);

      if (updateError) {
        throw new Error('Failed to update promises_done count');
      }

      setLocalUserData((prev) =>
        prev ? { ...prev, promises_done: Math.max(0, (prev.promises_done ?? 0) + updateDone) } : prev
      );
    } catch (error) {
      setError('Error updating promises_done in DB');
      console.error('Error:', error);
    }
  };

  if (isLoading || userLoading || !localUserData) {
    return <Load />;
  }

  const fullName = `${localUserData.first_name || ''} ${localUserData.last_name || ''}`.trim() || '';
  const promisesCount = promises.length;
  const promisesDoneCount = promises.filter((p) => p.is_completed).length;

  console.log('Local User Data:', localUserData);

  return (
    <>
      <Header />
      <Leftnav />
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
                  fullName={fullName}
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