// frontend/src/app/user/[telegramId]/page.tsx
'use client'

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { useUser } from '@/context/UserContext';

import Header from '@/components/Header';
import Leftnav from '@/components/Leftnav';
import Appfooter from '@/components/Appfooter';
import ProfilecardThree from '@/components/ProfilecardThree';
import Profiledetail from '@/components/Profiledetail';
import { AnimatePresence, motion } from 'framer-motion';

// Импорт общих типов
import { UserData, PromiseData } from '@/types';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function UserProfile() {
  const { telegramId: paramTelegramId } = useParams();
  const { telegramId: contextTelegramId, setTelegramId } = useUser();
  const [showProfileDetail, setShowProfileDetail] = useState(true);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [promises, setPromises] = useState<PromiseData[]>([]);
  const [openPromiseId, setOpenPromiseId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      const id = parseInt(paramTelegramId as string, 10) || contextTelegramId || 0;
      if (!id) {
        setUserData({ nickname: 'Guest', telegram_id: 0, first_name: '', last_name: '' });
        setIsLoading(false);
        return;
      }

      setTelegramId(id);

      console.time('Total fetch time');
      try {
        // Fetch user data
        console.time('Supabase query - user');
        const { data: userDataResp, error: userError } = await supabase
          .from('users')
          .select('telegram_id, username, first_name, last_name, subscribers, promises, promises_done, stars')
          .eq('telegram_id', id)
          .single();

        console.timeEnd('Supabase query - user');
        if (userError || !userDataResp) {
          console.error('Error fetching user from Supabase:', userError?.message);
          setUserData({ nickname: 'Guest', telegram_id: id, first_name: '', last_name: '' });
        } else {
          setUserData({
            telegram_id: userDataResp.telegram_id,
            nickname: userDataResp.username || 'Guest',
            first_name: userDataResp.first_name || '',
            last_name: userDataResp.last_name || '',
            subscribers: userDataResp.subscribers || 0,
            promises: userDataResp.promises || 0,
            promises_done: userDataResp.promises_done || 0,
            stars: userDataResp.stars || 0,
          });
        }

        // Fetch promises
        console.time('Supabase query - promises');
        const { data: promisesData, error: promisesError } = await supabase
          .from('promises')
          .select('*')
          .eq('user_id', id)
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

    fetchData();

  }, [paramTelegramId, contextTelegramId, setTelegramId]);

  if (isLoading) {
    return <div className="text-center p-5">Loading...</div>;
  }

  const fullName = `${userData?.first_name || ''} ${userData?.last_name || ''}`.trim() || 'Guest';
  const promisesCount = promises.length;
  const promisesDoneCount = promises.filter((p) => p.is_completed).length;

  const handleDelete = (id: string) => {
    setPromises((prev) => prev.filter((p) => p.id !== id));
  };

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
                  nickname={userData?.nickname || 'Guest'}
                  telegramId={userData?.telegram_id || 0}
                  subscribers={userData?.subscribers || 0}
                  promises={promisesCount}
                  promisesDone={promisesDoneCount}
                  stars={userData?.stars || 0}
                  fullName={fullName}
                  isEditable={false} // Только просмотр
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
                        nickname={userData?.nickname || 'Guest'}
                        telegramId={userData?.telegram_id || 0}
                        fullName={fullName}
                        isEditable={false} // Только просмотр
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