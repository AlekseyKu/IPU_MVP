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

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function UserProfile() {
  const { telegramId: paramTelegramId } = useParams();
  const { telegramId: contextTelegramId, setTelegramId } = useUser();
  const [showProfileDetail, setShowProfileDetail] = useState(false);
  const [userData, setUserData] = useState<{ login: string; telegramId: number } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      setIsLoading(true);
      const id = parseInt(paramTelegramId as string, 10) || contextTelegramId || 0;
      if (!id) {
        setUserData({ login: 'Guest', telegramId: 0 });
        setIsLoading(false);
        return;
      }

      setTelegramId(id);

      console.time('Total fetch time');
      console.time('Supabase query');
      const { data, error } = await supabase
        .from('users')
        .select('telegram_id, username')
        .eq('telegram_id', id)
        .single();

      console.log('Supabase response:', { data, error });
      console.timeEnd('Supabase query');

      if (error || !data) {
        console.error('Error fetching user from Supabase:', error?.message);
        setUserData({ login: 'Guest', telegramId: id });
      } else {
        setUserData({ login: data.username || 'Guest', telegramId: data.telegram_id });
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
                  login={userData?.login}
                  telegramId={userData?.telegramId}
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
                      <Profiledetail login={userData?.login} telegramId={userData?.telegramId} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="col-xl-8 col-xxl-9 col-lg-8">
                <Createpost />
                <Postview
                  id="32"
                //   postvideo="postvideo.mp4"
                  postvideo=""
                  postimage="post.png"
                  avater="user.png"
                  user={userData?.login || 'Guest'}
                  time="22 min ago"
                  des="Lorem ipsum dolor sit amet..."
                />
                <Postview
                  id="31"
                  postvideo=""
                  postimage="post.png"
                  avater="user.png"
                  user={userData?.login || 'Guest'}
                  time="22 min ago"
                  des="Lorem ipsum dolor sit amet..."
                />
                <Postview
                  id="33"
                  postvideo=""
                  postimage="post.png"
                  avater="user.png"
                  user={userData?.login || 'Guest'}
                  time="2 hour ago"
                  des="Lorem ipsum dolor sit amet..."
                />
                {/* <Load /> */}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Appfooter />
    </>
  );
}