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

  const telegramId = parseInt(paramTelegramId as string, 10) || contextTelegramId || 0;
  const { userData, isLoading: userLoading, defaultHeroImg, defaultAvatarImg } = useUserData(telegramId);

  useEffect(() => {
    async function fetchData() {
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
        } else {
          setPromises(promisesData || []);
        }
      } catch (error) {
        console.error('General error:', error);
      } finally {
        setIsLoading(false);
        console.timeEnd('Total fetch time');
      }
    }

    if (telegramId) {
      fetchData();
    } else {
      setIsLoading(false);
    }

    const insertSubscription = supabase
      .channel(`promises-insert-${paramTelegramId || contextTelegramId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'promises', filter: `user_id=eq.${telegramId}` },
        (payload) => {
          setPromises((prev) => [payload.new as PromiseData, ...prev.filter((p) => p.id !== payload.new.id)]);
        }
      )
      .subscribe();

    const updateSubscription = supabase
      .channel(`promises-update-${paramTelegramId || contextTelegramId}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'promises', filter: `user_id=eq.${telegramId}` },
        (payload) => {
          setPromises((prev) =>
            prev.map((p) => (p.id === payload.new.id ? (payload.new as PromiseData) : p))
          );
        }
      )
      .subscribe();

    const deleteSubscription = supabase
      .channel(`promises-delete-${paramTelegramId || contextTelegramId}`)
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'promises', filter: `user_id=eq.${telegramId}` },
        (payload) => {
          setPromises((prev) => prev.filter((p) => p.id !== payload.old.id));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(insertSubscription);
      supabase.removeChannel(updateSubscription);
      supabase.removeChannel(deleteSubscription);
    };
  }, [paramTelegramId, contextTelegramId, telegramId, setTelegramId]);

  if (isLoading || userLoading) {
    return <Load />;
  }

  if (!userData) {
    return <div className="text-center p-5">Пользователь не найден</div>;
  }

  const fullName = `${userData.first_name || ''} ${userData.last_name || ''}`.trim() || '';
  const promisesCount = promises.length;
  const promisesDoneCount = promises.filter((p) => p.is_completed).length;

  const handleDelete = (id: string) => {
    setPromises((prev) => prev.filter((p) => p.id !== id));
  };

  console.log('User Data:', userData);

  return (
    <>
      <Header />
      <Leftnav />
      <div className="main-content">
        <div className="middle-sidebar-bottom">
          <div className="middle-sidebar-left pe-0">
            <div className="row">
              <div className="col-xl-12 mb-3">
                <ProfilecardThree
                  onToggleDetail={() => setShowProfileDetail((prev) => !prev)}
                  isOpen={showProfileDetail}
                  username={userData.username || ''}
                  fullName={fullName}
                  telegramId={userData.telegram_id}
                  subscribers={userData.subscribers || 0}
                  promises={promisesCount}
                  promisesDone={promisesDoneCount}
                  stars={userData.stars || 0}
                  heroImgUrl={userData.hero_img_url || defaultHeroImg}
                  avatarUrl={userData.avatar_img_url || defaultAvatarImg}
                  isEditable={false}
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
                        username={userData.username || ''}
                        telegramId={userData.telegram_id}
                        fullName={fullName}
                        about={userData.about || ''}
                        // address={userData.address || ''}
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
                        onUpdate={(updatedPromise) =>
                          setPromises((prev: PromiseData[]) =>
                            prev.map((p) => (p.id === updatedPromise.id ? updatedPromise : p))
                          )
                        }
                        onDelete={handleDelete}
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