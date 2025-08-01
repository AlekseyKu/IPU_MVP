// frontend/src/app/user/[telegramId]/page.tsx
'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { useUser } from '@/context/UserContext'
import { supabase } from '@/lib/supabaseClient'
import Header from '@/components/Header'
import Appfooter from '@/components/Appfooter'
import PromiseView from '@/components/PromiseView'
import ChallengeView from '@/components/ChallengeView'
import ProfilecardThree from '@/components/ProfilecardThree'
import Profiledetail from '@/components/Profiledetail'
import Load from '@/components/Load'
import { AnimatePresence, motion } from 'framer-motion'
import { UserData, PromiseData, ChallengeData, PostData, User } from '@/types'
import { useUserData } from '@/hooks/useUserData'
import { usePromiseApi } from '@/hooks/usePromiseApi';
import { useChallengeApi } from '@/hooks/useChallengeApi';
import { useChallengeParticipants } from '@/hooks/useChallengeParticipants';

// type guards
function isPromiseData(post: PostData): post is PromiseData {
  return 'is_completed' in post && 'deadline' in post
}

function isChallengeData(post: PostData): post is ChallengeData {
  return 'frequency' in post && 'total_reports' in post && 'completed_reports' in post
}

type ChallengeWithOwner = ChallengeData & { owner?: User };

export default function UserProfile() {
  const { telegramId: paramId } = useParams()
  const { telegramId: ctxId, setTelegramId } = useUser()
  const telegramId = useMemo(
    () => Number(paramId) || ctxId || 0,
    [paramId, ctxId]
  )

  const [showProfileDetail, setShowProfileDetail] = useState(false)
  const [allPosts, setAllPosts] = useState<(PromiseData | ChallengeData)[]>([])
  const [openPostId, setOpenPostId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  // Убираем localUser - используем напрямую userData
  // const [localUser, setLocalUser] = useState<UserData | null>(null)
  const [subscribedChallenges, setSubscribedChallenges] = useState<ChallengeData[]>([])

  const isOwn = ctxId === telegramId

  // Функция для перезагрузки данных пользователя - стабилизируем с useCallback
  const loadUserData = useCallback(async () => {
    if (!telegramId || isNaN(telegramId)) return;
    
    try {
      const [ownPromisesRes, receivedPromisesRes, cRes] = await Promise.all([
        supabase
          .from('promises')
          .select('*')
          .eq('user_id', telegramId)
          .order('created_at', { ascending: false }),
        supabase
          .from('promises')
          .select('*')
          .eq('recipient_id', telegramId)
          .order('created_at', { ascending: false }),
        supabase
          .from('challenges')
          .select('*')
          .eq('user_id', telegramId)
          .order('created_at', { ascending: false }),
      ]);

      if (ownPromisesRes.error) throw ownPromisesRes.error;
      if (receivedPromisesRes.error) throw receivedPromisesRes.error;
      if (cRes.error) throw cRes.error;

      const merged = [
        ...(ownPromisesRes.data || []),
        ...(receivedPromisesRes.data || []),
        ...(cRes.data || []),
      ].sort(
        (a, b) =>
          new Date(b.created_at).getTime() -
          new Date(a.created_at).getTime()
      );
      
      setAllPosts(merged);
      console.log('📝 Posts list reloaded');
    } catch (error) {
      console.error('Error reloading posts:', error);
    }
  }, [telegramId]);



  const handlePostsUpdate = useCallback((payload: any) => {
    console.log('🔍 handlePostsUpdate called:', { eventType: payload.eventType, id: payload.new?.id || payload.old?.id, timestamp: Date.now() });
    
    // Для всех событий перезагружаем весь список для избежания дублирования
    loadUserData();
  }, [loadUserData]);

  const handleChallengesUpdate = useCallback((payload: any) => {
    // Для всех событий перезагружаем весь список для избежания дублирования
    loadUserData();
  }, [loadUserData]);

  // Централизованная система real-time обновлений через useUserData
  const { userData, isLoading: userLoading, defaultHeroImg, defaultAvatarImg } = useUserData({ 
    telegramId,
    onPostsUpdate: handlePostsUpdate,
    onChallengesUpdate: handleChallengesUpdate
  });

  // --- Новый блок: фильтрация постов для разных пользователей ---
  const filteredPosts = useMemo(() => {
    if (isOwn) {
      // Для владельца профиля показываем все его посты (собственные + адресованные ему)
      return allPosts;
    }
    
    // Для других пользователей фильтруем посты
    return allPosts.filter(post => {
      if (isPromiseData(post)) {
        // Обещание себе - показываем только публичные
        if (!post.requires_accept) {
          return post.is_public;
        }
        // Обещание "кому-то" - показываем только если адресовано текущему пользователю
        return post.is_public && post.recipient_id === ctxId;
      }
      // Челленджи - показываем все (старая логика)
      return true;
    });
  }, [allPosts, isOwn, ctxId]);
  // --- конец блока фильтрации ---

  const updatePosts = (
    post: PromiseData | ChallengeData,
    eventType: 'INSERT' | 'UPDATE' | 'DELETE'
  ) => {
    // Убираем логирование - updatePosts больше не должен вызываться
    // console.log('[updatePosts]', eventType, post);
    setAllPosts((prev) => {
      let list = [...prev]

      if (eventType === 'INSERT') {
        list = [post, ...list]
      } else if (eventType === 'UPDATE') {
        list = list.map((p) => (p.id === post.id ? post : p))
      } else {
        list = list.filter((p) => p.id !== post.id)
      }

      return list.sort(
        (a, b) =>
          new Date(b.created_at).getTime() -
          new Date(a.created_at).getTime()
      )
    })
  }

  const { handleDelete, handleUpdate } = usePromiseApi(updatePosts, setError);
  const { handleDeleteChallenge, handleUpdateChallenge } = useChallengeApi(updatePosts, setError);

  // Функция для получения имени пользователя по ID
  const getUserName = (userId: number) => {
    if (userId === telegramId) {
      return `${userData?.first_name || ''} ${userData?.last_name || ''}`.trim() || `@${userId}`;
    }
    // Для других пользователей показываем ID, можно добавить загрузку данных
    return `@${userId}`;
  };

  // Функция для получения аватара пользователя по ID
  const getUserAvatar = (userId: number) => {
    if (userId === telegramId) {
      return userData?.avatar_img_url || defaultAvatarImg;
    }
    // Для других пользователей используем дефолтный аватар
    return '/assets/images/defaultAvatar.png';
  };

  // --- Новый блок: загрузка информации о создателях обещаний ---
  const [promiseCreators, setPromiseCreators] = useState<Record<number, UserData>>({});

  const loadPromiseCreators = async (promises: PromiseData[]) => {
    const creatorIds = promises
      .filter(p => p.user_id !== telegramId) // Только создатели, которые не являются владельцем профиля
      .map(p => p.user_id)
      .filter((id, index, arr) => arr.indexOf(id) === index); // Уникальные ID

    if (creatorIds.length === 0) return;

    try {
      const { data: creators, error } = await supabase
        .from('users')
        .select('telegram_id, username, first_name, last_name, avatar_img_url')
        .in('telegram_id', creatorIds);

      if (error) {
        console.error('Error loading promise creators:', error);
        return;
      }

      const creatorsMap = (creators || []).reduce((acc, creator) => {
        acc[creator.telegram_id] = creator;
        return acc;
      }, {} as Record<number, UserData>);

      setPromiseCreators(creatorsMap);
    } catch (error) {
      console.error('Error loading promise creators:', error);
    }
  };
  // --- конец блока загрузки создателей ---

  // Загрузка подписанных челленджей
  const loadSubscribedChallenges = async () => {
    if (!telegramId) return;
    try {
      // Получаем челленджи, на которые подписан пользователь, с JOIN на владельца
      const { data: participants, error } = await supabase
        .from('challenge_participants')
        .select(`
          challenge_id,
          challenges!challenge_participants_challenge_id_fkey (
            *,
            owner:user_id (
              telegram_id,
              username,
              first_name,
              last_name,
              avatar_img_url
            )
          )
        `)
        .eq('user_id', telegramId);
      if (error) {
        console.error('Error loading subscribed challenges:', error);
        return;
      }
      // 2. Формируем массив с owner
      const challenges = (participants
        ?.map(p => {
          const challenge = Array.isArray(p.challenges) ? p.challenges[0] : p.challenges;
          if (!challenge) return null;
          let owner = Array.isArray(challenge.owner) ? challenge.owner[0] : challenge.owner;
          if (!challenge.id || !challenge.frequency) return null;
          return {
            ...challenge,
            owner: owner
          };
        })
        .filter(Boolean) as ChallengeWithOwner[] || []);
      setSubscribedChallenges(challenges);
      setAllPosts(prev => {
        const existingIds = new Set(prev.map(post => post.id));
        const newChallenges = challenges.filter(challenge => challenge && !existingIds.has(challenge.id));
        if (newChallenges.length === 0) return prev;
        const updated = [...prev, ...newChallenges] as (PromiseData | ChallengeWithOwner)[];
        return updated.sort(
          (a, b) => new Date((b as ChallengeWithOwner).created_at).getTime() - new Date((a as ChallengeWithOwner).created_at).getTime()
        );
      });
    } catch (error) {
      console.error('Error loading subscribed challenges:', error);
    }
  };

  useEffect(() => {
    if (userData) {
      console.log('📊 User stats updated:', {
        promises: userData.promises,
        promises_done: userData.promises_done,
        challenges: userData.challenges,
        challenges_done: userData.challenges_done,
        total: (userData.promises || 0) + (userData.challenges || 0),
        total_done: (userData.promises_done || 0) + (userData.challenges_done || 0)
      });
    }
  }, [userData?.promises, userData?.promises_done, userData?.challenges, userData?.challenges_done])

  // Удаляем дублирующую подписку - оставляем только в useUserData
  // useEffect(() => {
  //   if (!telegramId) return;
  //   console.log('Setting up user stats subscription for telegramId:', telegramId);
  //   const channel = supabase
  //     .channel(`user-stats-${telegramId}`)
  //     .on(
  //       'postgres_changes',
  //       { 
  //         event: 'UPDATE', 
  //         schema: 'public', 
  //         table: 'users', 
  //         filter: `telegram_id=eq.${telegramId}` 
  //       },
  //       (payload) => {
  //         console.log('User stats updated via subscription:', payload);
  //         console.log('Old stats:', payload.old);
  //         console.log('New stats:', payload.new);
  //         console.log('New data promises:', payload.new.promises);
  //         console.log('New data promises_done:', payload.new.promises_done);
  //         console.log('New data challenges:', payload.new.challenges);
  //         console.log('New data challenges_done:', payload.new.challenges_done);
  //         
  //         // Обновляем localUser при изменении статистики
  //         if (payload.new) {
  //           console.log('Updating localUser with new data');
  //           setLocalUser(payload.new as UserData);
  //         }
  //       }
  //     )
  //     .subscribe((status) => {
  //       console.log('User stats subscription status:', status);
  //     });
  //   return () => {
  //     console.log('Cleaning up user stats subscription for telegramId:', telegramId);
  //     supabase.removeChannel(channel);
  //   };
  // }, [telegramId]);

  useEffect(() => {
    if (!telegramId || isNaN(telegramId)) {
      setError('Invalid telegramId')
      setIsLoading(false)
      return
    }
    
    setIsLoading(true)
    setTelegramId(telegramId)

    Promise.all([
      // --- Загружаем собственные обещания пользователя ---
      supabase
        .from('promises')
        .select('*')
        .eq('user_id', telegramId)
        .order('created_at', { ascending: false }),
      // --- Загружаем обещания, адресованные пользователю ---
      supabase
        .from('promises')
        .select('*')
        .eq('recipient_id', telegramId)
        .order('created_at', { ascending: false }),
      supabase
        .from('challenges')
        .select('*')
        .eq('user_id', telegramId)
        .order('created_at', { ascending: false }),
    ])
      .then(([ownPromisesRes, receivedPromisesRes, cRes]) => {
        if (ownPromisesRes.error) throw ownPromisesRes.error
        if (receivedPromisesRes.error) throw receivedPromisesRes.error
        if (cRes.error) throw cRes.error

        const merged = [
          ...(ownPromisesRes.data || []),
          ...(receivedPromisesRes.data || []),
          ...(cRes.data || []),
        ].sort(
          (a, b) =>
            new Date(b.created_at).getTime() -
            new Date(a.created_at).getTime()
        )
        setAllPosts(merged)
        
        // --- Загружаем информацию о создателях обещаний ---
        const allPromises = [
          ...(ownPromisesRes.data || []),
          ...(receivedPromisesRes.data || [])
        ] as PromiseData[];
        loadPromiseCreators(allPromises);
      })
      .catch((err) => {
        console.error(err)
        setError('General error occurred')
      })
      .finally(() => {
        setIsLoading(false)
      })

    // Загружаем подписанные челленджи после загрузки основных данных
    setTimeout(() => {
      loadSubscribedChallenges();
    }, 100); // Небольшая задержка для обеспечения загрузки основных данных
  }, [paramId, ctxId])

  // Удаляем старую подписку - теперь используем централизованную систему
  // useEffect(() => {
  //   if (!telegramId) return;
  //   console.log('📝 Setting up promises list subscription for telegramId:', telegramId);
  //   let retryCount = 0;
  //   const maxRetries = 3;
  //   const setupSubscription = () => {
  //     const channel = supabase
  //       .channel(`promises-list-${telegramId}-${Date.now()}`)
  //       .on(
  //         'postgres_changes',
  //         {
  //           event: '*',
  //           schema: 'public',
  //           table: 'promises',
  //           filter: `user_id=eq.${telegramId}`
  //         },
  //         (payload) => {
  //           console.log('📝 Promises list updated:', payload);
  //           loadUserData();
  //         }
  //       )
  //       .on(
  //         'postgres_changes',
  //         {
  //           event: '*',
  //           schema: 'public',
  //           table: 'promises',
  //           filter: `recipient_id=eq.${telegramId}`
  //         },
  //         (payload) => {
  //           console.log('📝 Promises list updated (recipient):', payload);
  //           loadUserData();
  //         }
  //       )
  //       .subscribe((status) => {
  //         console.log('📝 Promises list subscription status:', status);
  //         if (status === 'CHANNEL_ERROR' && retryCount < maxRetries) {
  //           console.log(`🔄 Retrying subscription (${retryCount + 1}/${maxRetries})...`);
  //           retryCount++;
  //           setTimeout(setupSubscription, 1000);
  //         }
  //       });
  //     return channel;
  //   };
  //   const channel = setupSubscription();
  //   return () => {
  //     console.log('🧹 Cleaning up promises list subscription for telegramId:', telegramId);
  //     supabase.removeChannel(channel);
  //   };
  // }, [telegramId]);

  // const handleChallengeUpdate = (updated: ChallengeData) => {
  //   updatePosts(updated, 'UPDATE')
  // }

  if (isLoading || userLoading || !userData) {
    return <Load />
  }

  // клиентская обработка кол-ва обещаний/челленджей и выполненных обещаний/челленджей
  // const promisesCount = allPosts.filter(isPromiseData).length
  // const promisesDone = allPosts.filter((p) => isPromiseData(p) && p.is_completed).length
  // const challengesCount = allPosts.filter((p) => isChallengeData(p) && p.user_id === telegramId).length
  // const challengesDone = allPosts.filter((p) => isChallengeData(p) && p.user_id === telegramId && p.completed_reports === p.total_reports).length

  // серверная обработка кол-ва обещаний/челленджей и выполненных обещаний/челленджей
  const promisesCount = userData?.promises || 0
  const promisesDone = userData?.promises_done || 0
  const challengesCount = userData?.challenges || 0
  const challengesDone = userData?.challenges_done || 0

  const fullName = `${userData.first_name} ${userData.last_name}`.trim()

  // Убираем лишние логи - оставляем только в useEffect выше
  // console.log('📈 Current stats:', { 
  //   promisesCount, 
  //   promisesDone, 
  //   challengesCount, 
  //   challengesDone 
  // });

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
                  onToggleDetail={() => setShowProfileDetail((v) => !v)}
                  isOpen={showProfileDetail}
                  username={userData.username || ''}
                  firstName={userData.first_name || ''}
                  lastName={userData.last_name || ''}
                  telegramId={userData.telegram_id}
                  subscribers={userData.subscribers || 0}
                  promises={promisesCount + challengesCount}
                  promisesDone={promisesDone + challengesDone}
                  karma_points={userData.karma_points || 0}
                  heroImgUrl={userData.hero_img_url || defaultHeroImg}
                  avatarUrl={userData.avatar_img_url || defaultAvatarImg}
                  isEditable={false}
                  isOwnProfile={isOwn}
                  isSubscribed={false}
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
                        about={userData.about}
                        isEditable={false}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <div className="col-xl-8 col-xxl-9 col-lg-8">
                <AnimatePresence>
                  {/* --- Изменено: используем filteredPosts вместо allPosts --- */}
                  {filteredPosts.map((post) =>
                    isPromiseData(post) ? (
                      <motion.div
                        key={post.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                      >
                        <PromiseView
                          promise={post}
                          onToggle={() =>
                            setOpenPostId(openPostId === post.id ? null : post.id)
                          }
                          isOpen={openPostId === post.id}
                          onUpdate={handleUpdate}
                          onDelete={handleDelete}
                          isOwnProfile={isOwn}
                          isOwnCreator={post.user_id === (ctxId || 0)}
                          avatarUrl={
                            post.user_id === telegramId 
                              ? (userData?.avatar_img_url || defaultAvatarImg)
                              : (promiseCreators[post.user_id]?.avatar_img_url || defaultAvatarImg)
                          }
                          userId={post.user_id}
                          userCtxId={ctxId || 0}
                          userName={
                            post.user_id === telegramId
                              ? fullName
                              : promiseCreators[post.user_id]
                                ? `${promiseCreators[post.user_id].first_name || ''} ${promiseCreators[post.user_id].last_name || ''}`.trim() || `@${post.user_id}`
                                : `@${post.user_id}`
                          }
                          isList
                          isProfilePage
                        />
                      </motion.div>
                    ) : (
                      <motion.div
                        key={post.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                      >
                        <ChallengeView
                          key={`${post.id}-${isChallengeData(post) ? post.completed_reports : ''}-${isChallengeData(post) ? post.start_at : ''}`}
                          challenge={post}
                          onToggle={() =>
                            setOpenPostId(openPostId === post.id ? null : post.id)
                          }
                          isOpen={openPostId === post.id}
                          onUpdate={updated => updatePosts(updated, 'UPDATE')}
                          onDelete={() => {
                            handleDeleteChallenge(post.id);
                            setSubscribedChallenges(prev => prev.filter(c => c.id !== post.id));
                          }}
                          isOwnProfile={post.user_id === telegramId}
                          avatarUrl={
                            isChallengeData(post) && (post as ChallengeWithOwner).owner?.avatar_img_url
                              ? (post as ChallengeWithOwner).owner!.avatar_img_url
                              : getUserAvatar(post.user_id)
                          }
                          userId={post.user_id}
                          userName={
                            isChallengeData(post) && (post as ChallengeWithOwner).owner
                              ? (
                                  ((post as ChallengeWithOwner).owner!.first_name || '') +
                                  ' ' +
                                  ((post as ChallengeWithOwner).owner!.last_name || '') ||
                                  (post as ChallengeWithOwner).owner!.username ||
                                  `@${post.user_id}`
                                ).trim()
                              : getUserName(post.user_id)
                          }
                          isList
                          isProfilePage
                          onStart={() => handleUpdateChallenge(post.id, telegramId, 'start')}
                          onCheckDay={() => handleUpdateChallenge(post.id, telegramId, 'check_day')}
                          onFinish={() => handleUpdateChallenge(post.id, telegramId, 'finish')}
                        />
                      </motion.div>
                    )
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Appfooter />
    </>
  )
}
