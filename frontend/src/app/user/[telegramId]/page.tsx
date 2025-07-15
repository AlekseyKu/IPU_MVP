// frontend/src/app/user/[telegramId]/page.tsx
'use client'

import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import { supabase } from '@/lib/supabaseClient';
import Header from '@/components/Header';
import Appfooter from '@/components/Appfooter';
import Postview from '@/components/Postview';
import ChallengeView from '@/components/ChallengeView';
import ProfilecardThree from '@/components/ProfilecardThree';
import Profiledetail from '@/components/Profiledetail';
import Load from '@/components/Load';
import { AnimatePresence, motion } from 'framer-motion';
import { UserData, PromiseData, ChallengeData, PostData } from '@/types';
import { useUserData } from '@/hooks/useUserData';
import usePromiseActions from '@/hooks/usePromiseActions';

// Типизация для проверки
function isPromiseData(post: PostData): post is PromiseData {
  return 'is_completed' in post && 'deadline' in post;
}

function isChallengeData(post: PostData): post is ChallengeData {
  return 'frequency' in post && 'total_reports' in post && 'completed_reports' in post;
}

export default function UserProfile() {
  const { telegramId: paramTelegramId } = useParams();
  const { telegramId: contextTelegramId, setTelegramId } = useUser();

  const telegramId = useMemo(
    () => Number(paramTelegramId) || contextTelegramId || 0,
    [paramTelegramId, contextTelegramId]
  );

  const [showProfileDetail, setShowProfileDetail] = useState(false);
  const [allPosts, setAllPosts] = useState<(PromiseData | ChallengeData)[]>([]);
  const [openPromiseId, setOpenPromiseId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [localUserData, setLocalUserData] = useState<UserData | null>(null);

  const { userData, isLoading: userLoading, defaultHeroImg, defaultAvatarImg } = useUserData(telegramId);
  const isOwnProfile = contextTelegramId === telegramId;

  const { handleSubscribe, handleDelete, handleUpdate } = usePromiseActions(
    telegramId,
    setLocalUserData,
    setError
  );

  useEffect(() => {
    if (userData) setLocalUserData(userData);
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

      try {
        const [promisesResult, challengesResult] = await Promise.all([
          supabase
            .from('promises')
            .select('*')
            .eq('user_id', telegramId)
            .order('created_at', { ascending: false }),
          supabase
            .from('challenges')
            .select('*')
            .eq('user_id', telegramId)
            .order('created_at', { ascending: false }),
        ]);

        // console.log('Promises data:', promisesResult.data);
        // console.log('Challenges data:', challengesResult.data);

        if (promisesResult.error) throw promisesResult.error;
        if (challengesResult.error) throw challengesResult.error;

        const allPosts = [
          ...(promisesResult.data || []),
          ...(challengesResult.data || []),
        ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

        setAllPosts(allPosts);
      } catch (error) {
        console.error(error);
        setError('General error occurred');
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [paramTelegramId, contextTelegramId]);

  useEffect(() => {
    if (!telegramId) return;

    const channel = supabase
      .channel(`posts-${telegramId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'promises' }, (payload) => {
        const updatedPromise = payload.new as PromiseData;
        updatePosts(updatedPromise, payload.eventType, payload.old);
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'challenges' }, (payload) => {
        const updatedChallenge = payload.new as ChallengeData;
        updatePosts(updatedChallenge, payload.eventType, payload.old);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [telegramId]);

  // Функция для обновления списка постов
  const updatePosts = (updatedPost: PromiseData | ChallengeData, eventType: string, old?: Partial<PostData>) => {
    setAllPosts((prev) => {
      let newPosts = [...prev];
      if (eventType === 'INSERT') {
        newPosts = [updatedPost, ...newPosts].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      } else if (eventType === 'UPDATE') {
        newPosts = newPosts.map((p) => (p.id === updatedPost.id ? updatedPost : p)).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      } else if (eventType === 'DELETE' && old?.id) {
        newPosts = newPosts.filter((p) => p.id !== old.id);
      }
      return newPosts;
    });
  };

  // Функция onUpdate для челленджей
  const handleChallengeUpdate = (updatedChallenge: ChallengeData) => {
    updatePosts(updatedChallenge, 'UPDATE');
  };

  if (isLoading || userLoading || !localUserData) {
    return <Load />;
  }

  const fullName = `${localUserData.first_name || ''} ${localUserData.last_name || ''}`.trim();
  const promisesCount = allPosts.filter((p): p is PromiseData => 'is_completed' in p).length;
  const promisesDoneCount = allPosts.filter((p): p is PromiseData => 'is_completed' in p && p.is_completed).length;
  const challengesCount = allPosts.filter((p): p is ChallengeData => 'frequency' in p).length;
  const challengesDoneCount = allPosts.filter((p): p is ChallengeData => 'frequency' in p && p.completed_reports === p.total_reports).length;

  return (
    <>
      <Header />
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
                  firstName={localUserData.first_name || ''}
                  lastName={localUserData.last_name || ''}
                  telegramId={localUserData.telegram_id}
                  subscribers={localUserData.subscribers || 0}
                  promises={promisesCount + challengesCount}
                  promisesDone={promisesDoneCount + challengesDoneCount}
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
                  {allPosts.map((post) => {
                    // console.log('Post data:', post);
                    if (isPromiseData(post)) {
                      const promise = post as PromiseData;
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
                            onToggle={() => setOpenPromiseId(openPromiseId === promise.id ? null : promise.id)}
                            isOpen={openPromiseId === promise.id}
                            onUpdate={handleUpdate}
                            onDelete={handleDelete}
                            isOwnProfile={isOwnProfile}
                            avatarUrl={localUserData.avatar_img_url || defaultAvatarImg}
                            userId={telegramId}
                            userName={fullName}
                            isList={true}
                            isProfilePage={true}
                          />
                        </motion.div>
                      );
                    } else if (isChallengeData(post)) {
                      const challenge = post as ChallengeData;
                      return (
                        <motion.div
                          key={challenge.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3, ease: 'easeOut' }}
                        >
                          <ChallengeView
                            challenge={challenge}
                            onToggle={() => setOpenPromiseId(openPromiseId === challenge.id ? null : challenge.id)}
                            isOpen={openPromiseId === challenge.id}
                            onUpdate={handleChallengeUpdate}
                            onDelete={handleDelete}
                            isOwnProfile={isOwnProfile}
                            avatarUrl={localUserData.avatar_img_url || defaultAvatarImg}
                            userId={telegramId}
                            userName={fullName}
                            isList={true}
                            isProfilePage={true}
                          />
                        </motion.div>
                      );
                    }

                    return null; // Fallback to satisfy TS
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