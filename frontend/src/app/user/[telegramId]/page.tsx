// frontend/src/app/user/[telegramId]/page.tsx
'use client'

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { useUser } from '@/context/UserContext';

import Header from '@/components/Header';
import Leftnav from '@/components/Leftnav';
import Appfooter from '@/components/Appfooter';
import Postview from '@/components/Postview';
import Createpost from '@/components/Createpost';
import ProfilecardThree from '@/components/ProfilecardThree';
import Profiledetail from '@/components/Profiledetail';
import Load from '@/components/Load';
import CreatepostModal from '@/components/modals/CreatepostModal';
import { AnimatePresence, motion } from 'framer-motion';

// Тип данных из Supabase с новым полем nickname
interface UserData {
  telegram_id: number;
  nickname: string | null;
  subscribers?: number;
  promises?: number;
  promises_done?: number;
  stars?: number;
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function UserProfile() {
  const { telegramId: paramTelegramId } = useParams();
  const { telegramId: contextTelegramId, setTelegramId } = useUser();
  const [showProfileDetail, setShowProfileDetail] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      setIsLoading(true);
      const id = parseInt(paramTelegramId as string, 10) || contextTelegramId || 0;
      if (!id) {
        setUserData({ nickname: 'Guest', telegram_id: 0 });
        setIsLoading(false);
        return;
      }

      setTelegramId(id);

      console.time('Total fetch time');
      console.time('Supabase query');
      const { data, error } = await supabase
        .from('users')
        .select('telegram_id, username, subscribers, promises, promises_done, stars')
        .eq('telegram_id', id)
        .single();

      console.log('Supabase response:', { data, error });
      console.timeEnd('Supabase query');

      if (error || !data) {
        console.error('Error fetching user from Supabase:', error?.message);
        setUserData({ nickname: 'Guest', telegram_id: id });
      } else {
        setUserData({
          telegram_id: data.telegram_id,
          nickname: data.username || 'Guest',
          subscribers: data.subscribers || 0,
          promises: data.promises || 0,
          promises_done: data.promises_done || 0,
          stars: data.stars || 0,
        });
      }
      setIsLoading(false);
      console.timeEnd('Total fetch time');
    }

    fetchUser();
  }, [paramTelegramId, contextTelegramId, setTelegramId]);

  if (isLoading) {
    return <div className="text-center p-5">Loading...</div>;
  }

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
                  promises={userData?.promises || 0}
                  promisesDone={userData?.promises_done || 0}
                  stars={userData?.stars || 0}
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
                      <Profiledetail nickname={userData?.nickname || 'Guest'} telegramId={userData?.telegram_id || 0} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="col-xl-8 col-xxl-9 col-lg-8">
                <Createpost />
                <Postview
                  id="32"
                  postvideo=""
                  postimage="post.png"
                  avater="user.png"
                  user={userData?.nickname || 'Guest'}
                  time="22 min ago"
                  des="Lorem ipsum dolor sit amet..."
                />
                <Postview
                  id="31"
                  postvideo=""
                  postimage="post.png"
                  avater="user.png"
                  user={userData?.nickname || 'Guest'}
                  time="22 min ago"
                  des="Lorem ipsum dolor sit amet..."
                />
                <Postview
                  id="33"
                  postvideo=""
                  postimage="post.png"
                  avater="user.png"
                  user={userData?.nickname || 'Guest'}
                  time="2 hour ago"
                  des="Lorem ipsum dolor sit amet..."
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