// frontend/src/app/list/page.tsx
'use client'

import { useState } from 'react';
import { useUser } from '@/context/UserContext';
import { useLanguage } from '@/context/LanguageContext';
import { usePublicPosts } from '@/hooks/usePublicPosts';
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
  const { t } = useLanguage();
  const { posts, users, subscriptions, isLoading, hasMore, loadMorePosts } = usePublicPosts(currentUserId);
  const [openPromiseId, setOpenPromiseId] = useState<string | null>(null);
  const [showSubscribedOnly, setShowSubscribedOnly] = useState(false);

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
                    {/* "Мои подписки" */}
                    {t('list.mySubscriptions')}
                  </label>
                </div>
              </div>
              <div className="col-12">
                {isLoading ? (
                  <div className="text-center py-12">
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                      <span className="text-gray-600">{/* "Загрузка постов..." */}{t('list.loadingPosts')}</span>
                    </div>
                  </div>
                ) : (
                  <AnimatePresence>
                    {filteredPosts.map((post) => {
                      const user = users[post.user_id] || { first_name: '', last_name: '', username: '', avatar_img_url: '' };
                      const fullName = `${user.first_name} ${user.last_name}`.trim() || user.username || t('list.guest');
                      const isOwnProfile = currentUserId === post.user_id;
                      const isPromise = isPromiseData(post); // Используем функцию проверки

                      // --- Новый блок: получение данных о получателе для обещаний "кому-то" ---
                      let recipientName = '';
                      let recipientAvatarUrl = '';
                      if (isPromise && (post as PromiseData).recipient_id) {
                        const recipient = users[(post as PromiseData).recipient_id!] || { first_name: '', last_name: '', username: '', avatar_img_url: '' };
                        recipientName = `${recipient.first_name} ${recipient.last_name}`.trim() || recipient.username || t('list.guest');
                        recipientAvatarUrl = recipient.avatar_img_url || '/assets/images/defaultAvatar.png';
                      }

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
                              recipientName={recipientName}
                              recipientAvatarUrl={recipientAvatarUrl}
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
                )}
                
                {/* Кнопка "Загрузить еще" */}
                {!isLoading && hasMore && (
                  <div className="text-center my-4 pb-2">
                    <button
                      onClick={loadMorePosts}
                      className="btn btn-outline-primary px-4 py-2"
                      
                    >
                      {t('list.loadMore')}
                    </button>
                  </div>
                )}
                

              </div>
            </div>
          </div>
        </div>
      </div>
      <Appfooter />
    </>
  );
}