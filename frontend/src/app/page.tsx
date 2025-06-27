// frontend\src\app\page.tsx
'use client';

import { Fragment, useEffect, useState } from 'react';
import Header from '@/components/Header';
import Leftnav from '@/components/Leftnav';
import Appfooter from '@/components/Appfooter';
import Postview from '@/components/Postview';
// import Createpost from '@/components/Createpost';
import ProfilecardThree from '@/components/ProfilecardThree';
import Profiledetail from '@/components/Profiledetail';
import Load from '@/components/Load';
import { AnimatePresence, motion } from 'framer-motion';

export default function Page() {
  const [showProfileDetail, setShowProfileDetail] = useState(false);
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const localPosts = localStorage.getItem('posts');
      if (localPosts) {
        setPosts(JSON.parse(localPosts));
      }
    }
  }, []);

  return (
    <Fragment>
      <Header />
      <Leftnav />
      <div className="flex flex-col min-h-screen">
        <div className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 mb-6">
                  <ProfilecardThree
                    onToggleDetail={() => setShowProfileDetail((prev) => !prev)}
                    isOpen={showProfileDetail}
                  />
                </div>

                <div className="lg:col-span-1 lg:w-1/3">
                  <AnimatePresence>
                    {showProfileDetail && (
                      <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 40 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                      >
                        <Profiledetail />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="lg:col-span-2 lg:w-2/3">
                  {/* <Createpost /> */}
                  {posts.length > 0 ? (
                    posts.map((post) => <Postview key={post.id} {...post} />)
                  ) : (
                    <p className="text-center text-gray-500 mt-8 font-medium">
                      Пока нет обещаний. Нажми <strong>+</strong> чтобы создать.
                    </p>
                  )}
                  {/* <Load /> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Appfooter />
    </Fragment>
  );
}