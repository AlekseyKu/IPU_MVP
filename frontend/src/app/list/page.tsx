'use client'
// frontend\src\app\list\page.tsx

import { useState } from 'react';
import { useUser } from '@/context/UserContext';
import { usePublicPromises } from '@/hooks/usePublicPromises';
import { AnimatePresence, motion } from 'framer-motion';
import Header from '@/components/Header';
import Appfooter from '@/components/Appfooter';
import Postview from '@/components/Postview';

export default function ListPage() {
  const { telegramId: currentUserId } = useUser();
  const { promises, users, subscriptions, isLoading } = usePublicPromises(currentUserId);
  // const [isOpen, setIsOpen] = useState<Record<string, boolean>>({});
  const [openPromiseId, setOpenPromiseId] = useState<string | null>(null);

  const [showSubscribedOnly, setShowSubscribedOnly] = useState(false);

  if (isLoading) {
    return <div className="text-center p-5">Loading...</div>;
  }

  // const toggleOpen = (id: string) => {
  //   setIsOpen((prev) => ({ ...prev, [id]: !prev[id] }));
  // };

  const toggleOpen = (id: string) => {
  setOpenPromiseId((prevId) => (prevId === id ? null : id));
};

  const noop = () => {};

  const filteredPromises = showSubscribedOnly && currentUserId
    ? promises.filter((p) => subscriptions.includes(p.user_id))
    : promises;

  return (
    <>
      <Header />
      <div className="main-content">
        <div className="middle-sidebar-bottom">
          <div className="middle-sidebar-left pe-0">
            <div className="row">
              <div className="col-12 px-3 py-1">
                <div className="form-check form-switch">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    style={{ transform: 'scale(1.4)' }}
                    checked={showSubscribedOnly}
                    onChange={(e) => setShowSubscribedOnly(e.target.checked)}
                    id="showSubscribedOnly"
                  />
                  <label className="form-check-label ms-1" htmlFor="showSubscribedOnly">
                    Мои подписки
                  </label>
                </div>
              </div>
              <div className="col-12">
                <AnimatePresence>
                  {filteredPromises.map((promise) => {
                    const user = users[promise.user_id] || { first_name: '', last_name: '', username: '', avatar_img_url: '' };
                    const fullName = `${user.first_name} ${user.last_name}`.trim() || user.username || 'Guest';
                    const isOwnProfile = currentUserId === promise.user_id;

                    return (
                      <motion.div
                        key={promise.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                      >
                        <Postview
                          promise={promise}
                          onToggle={() => toggleOpen(promise.id)}
                          // isOpen={!!isOpen[promise.id]}
                          isOpen={openPromiseId === promise.id}
                          onUpdate={noop}
                          onDelete={noop}
                          isOwnProfile={isOwnProfile}
                          isList={true}
                          avatarUrl={user.avatar_img_url}
                          userId={promise.user_id}
                          userName={fullName}
                        />
                      </motion.div>
                    );
                  })}
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
