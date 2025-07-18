// frontend/src/app/list/page.tsx
'use client'

import { useState } from 'react';
import { useUser } from '@/context/UserContext';
import { usePublicPromises } from '@/hooks/usePublicPromises';
import { AnimatePresence, motion } from 'framer-motion';
import Header from '@/components/Header';
import Appfooter from '@/components/Appfooter';
import PromiseView from '@/components/PromiseView';
import ChallengeView from '@/components/ChallengeView';
import { PromiseData, ChallengeData } from '@/types';

// Функции для проверки типов
function isPromiseData(post: any): post is PromiseData {
  return 'is_completed' in post && 'deadline' in post;
}

function isChallengeData(post: any): post is ChallengeData {
  return 'frequency' in post && 'total_reports' in post && 'completed_reports' in post;
}

export default function ListPage() {
  const { telegramId: currentUserId } = useUser();
  const { posts, users, subscriptions, isLoading } = usePublicPromises(currentUserId);
  const [openPromiseId, setOpenPromiseId] = useState<string | null>(null);
  const [showSubscribedOnly, setShowSubscribedOnly] = useState(false);

  if (isLoading) {
    return <div className="text-center p-5">Loading...</div>;
  }

  const toggleOpen = (id: string) => {
    setOpenPromiseId((prevId) => (prevId === id ? null : id));
  };

  const noop = () => {};

  const filteredPosts = showSubscribedOnly && currentUserId
    ? posts.filter((p) => subscriptions.includes(p.user_id))
    : posts;

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
                  {filteredPosts.map((post) => {
                    const user = users[post.user_id] || { first_name: '', last_name: '', username: '', avatar_img_url: '' };
                    const fullName = `${user.first_name} ${user.last_name}`.trim() || user.username || 'Guest';
                    const isOwnProfile = currentUserId === post.user_id;
                    const isPromise = isPromiseData(post); // Используем функцию проверки

                    return (
                      <motion.div
                        key={post.id} // Типизация гарантирует наличие id
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                      >
                        {isPromise ? (
                          <PromiseView
                            promise={post as PromiseData}
                            onToggle={() => toggleOpen(post.id)}
                            isOpen={openPromiseId === post.id}
                            onUpdate={noop}
                            onDelete={noop}
                            isOwnProfile={isOwnProfile}
                            isList={true}
                            avatarUrl={user.avatar_img_url}
                            userId={post.user_id}
                            userName={fullName}
                          />
                        ) : (
                          <ChallengeView
                            challenge={post as ChallengeData}
                            onToggle={() => toggleOpen(post.id)}
                            isOpen={openPromiseId === post.id}
                            onUpdate={noop}
                            onDelete={noop}
                            isOwnProfile={isOwnProfile}
                            isList={true}
                            avatarUrl={user.avatar_img_url}
                            userId={post.user_id}
                            userName={fullName}
                          />
                        )}
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