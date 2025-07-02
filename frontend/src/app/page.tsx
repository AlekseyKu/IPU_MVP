'use client'

import { Suspense } from 'react';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

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

export default function Page() {
  const [showProfileDetail, setShowProfileDetail] = useState(false);
  const [userData, setUserData] = useState<{ login: string; telegramId: number } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const searchParams = useSearchParams(); // Получаем searchParams здесь

  useEffect(() => {
    async function fetchUser() {
      setIsLoading(true);
      let telegramId: number | undefined;
      let login: string | undefined;

      // Логирование старта
      console.time('Total fetch time');
      console.time('Telegram data processing');

      // Получаем telegramId из tgWebAppData
      if (typeof window !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.hash.substring(1));
        const tgWebAppData = urlParams.get('tgWebAppData');
        if (!tgWebAppData) {
          console.error('No tgWebAppData found');
          setIsLoading(false);
          return;
        }

        try {
          const decodedData = decodeURIComponent(tgWebAppData);
          const userDataFromWebApp = JSON.parse(decodedData.split('&user=')[1].split('&')[0]);
          console.log('Parsed user data:', userDataFromWebApp);
          if (userDataFromWebApp?.id) {
            telegramId = userDataFromWebApp.id;
            console.log('Telegram user ID from WebApp:', telegramId);
          } else {
            console.error('No user ID in tgWebAppData');
          }
        } catch (error) {
          console.error('Parsing error:', error);
          setIsLoading(false);
          return;
        }
        console.timeEnd('Telegram data processing');
      }

      // Фallback для локального теста
      if (!telegramId && searchParams.get('telegram_id')) {
        telegramId = parseInt(searchParams.get('telegram_id')!, 10);
        login = 'testuser';
        console.log('Fallback to URL param for local test:', telegramId, 'Login:', login);
      }

      if (!telegramId) {
        setUserData({ login: 'Guest', telegramId: 0 });
        setIsLoading(false);
        return;
      }

      // Запрос к Supabase
      console.time('Supabase query');
      const { data, error } = await supabase
        .from('users')
        .select('telegram_id, username')
        .eq('telegram_id', telegramId)
        .single();

      console.log('Supabase response:', { data, error });
      console.timeEnd('Supabase query');

      if (error || !data) {
        console.error('Error fetching user from Supabase:', error?.message);
        setUserData({ login: 'Guest', telegramId });
      } else {
        setUserData({ login: data.username || 'Guest', telegramId: data.telegram_id });
      }
      setIsLoading(false);
      console.timeEnd('Total fetch time');
    }

    fetchUser();
  }, [searchParams]);

  if (isLoading) {
    return <div className="text-center p-5">Loading...</div>;
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
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
                  postvideo="postvideo.mp4"
                  postimage="post.png"
                  avater="user.png"
                  user={userData?.login || 'Guest'}
                  time="22 min ago"
                  des="Lorem ipsum dolor sit amet..."
                />
                <Postview
                  id="31"
                  postvideo="postvideo.mp4"
                  postimage="post.png"
                  avater="user.png"
                  user={userData?.login || 'Guest'}
                  time="22 min ago"
                  des="Lorem ipsum dolor sit amet..."
                />
                <Postview
                  id="33"
                  postvideo="postvideo.mp4"
                  postimage="post.png"
                  avater="user.png"
                  user={userData?.login || 'Guest'}
                  time="2 hour ago"
                  des="Lorem ipsum dolor sit amet..."
                />
                <Load />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Appfooter />
    </Suspense>
  );
}