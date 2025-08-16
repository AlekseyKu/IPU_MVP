// frontend/src/app/user/[telegramId]/page.tsx
'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { useUser } from '@/context/UserContext'
import { useLanguage } from '@/context/LanguageContext'
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
  const { t } = useLanguage()
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
  
  // Пагинация
  const [displayedPosts, setDisplayedPosts] = useState<(PromiseData | ChallengeData)[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const postsPerPage = 10

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
      
      // Инициализируем отображаемые посты
      const initialPosts = merged.slice(0, postsPerPage);
      setDisplayedPosts(initialPosts);
      setHasMore(merged.length > postsPerPage);
      setCurrentPage(1);
      
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

  // Обновляем отображаемые посты при изменении filteredPosts
  useEffect(() => {
    const initialPosts = filteredPosts.slice(0, postsPerPage);
    setDisplayedPosts(initialPosts);
    setHasMore(filteredPosts.length > postsPerPage);
    setCurrentPage(1);
  }, [filteredPosts, postsPerPage]);

  // Функция для загрузки дополнительных постов
  const loadMorePosts = () => {
    const nextPage = currentPage + 1;
    const startIndex = (nextPage - 1) * postsPerPage;
    const endIndex = startIndex + postsPerPage;
    const newPosts = filteredPosts.slice(startIndex, endIndex);
    
    setDisplayedPosts(prev => [...prev, ...newPosts]);
    setCurrentPage(nextPage);
    setHasMore(endIndex < filteredPosts.length);
  };

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
  // --- Новый блок: загрузка информации о получателях обещаний ---
  const [promiseRecipients, setPromiseRecipients] = useState<Record<number, UserData>>({});

  const loadPromiseCreators = async (promises: PromiseData[]) => {
    const creatorIds = promises
      .filter(p => p.user_id !== telegramId) // Только создатели, которые не являются владельцем профиля
      .map(p => p.user_id)
      .filter((id, index, arr) => arr.indexOf(id) === index); // Уникальные ID

    if (creatorIds.length === 0) return;

    try {
      const { data: creators, error } = await supabase
        .from('users')
        .select('telegram_id, first_name, last_name, username, avatar_img_url')
        .in('telegram_id', creatorIds);

      if (!error && creators) {
        const mapped = creators.reduce((acc, creator) => {
          acc[creator.telegram_id] = {
            telegram_id: creator.telegram_id,
            first_name: creator.first_name || '',
            last_name: creator.last_name || '',
            username: creator.username || '',
            avatar_img_url: creator.avatar_img_url || '',
          };
          return acc;
        }, {} as Record<number, UserData>);
        setPromiseCreators(mapped);
      }
    } catch (error) {
      console.error('Error loading promise creators:', error);
    }
  };

  // --- Новый блок: загрузка информации о получателях обещаний ---
  const loadPromiseRecipients = async (promises: PromiseData[]) => {
    const recipientIds = promises
      .filter(p => p.recipient_id && p.recipient_id !== telegramId) // Только получатели, которые не являются владельцем профиля
      .map(p => p.recipient_id!)
      .filter((id, index, arr) => arr.indexOf(id) === index); // Уникальные ID

    if (recipientIds.length === 0) return;

    try {
      const { data: recipients, error } = await supabase
        .from('users')
        .select('telegram_id, first_name, last_name, username, avatar_img_url')
        .in('telegram_id', recipientIds);

      if (!error && recipients) {
        const mapped = recipients.reduce((acc, recipient) => {
          acc[recipient.telegram_id] = {
            telegram_id: recipient.telegram_id,
            first_name: recipient.first_name || '',
            last_name: recipient.last_name || '',
            username: recipient.username || '',
            avatar_img_url: recipient.avatar_img_url || '',
          };
          return acc;
        }, {} as Record<number, UserData>);
        setPromiseRecipients(mapped);
      }
    } catch (error) {
      console.error('Error loading promise recipients:', error);
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
        
        // Инициализируем отображаемые посты
        const initialPosts = merged.slice(0, postsPerPage);
        setDisplayedPosts(initialPosts);
        setHasMore(merged.length > postsPerPage);
        setCurrentPage(1);
        
        // --- Загружаем информацию о создателях обещаний ---
        const allPromises = [
          ...(ownPromisesRes.data || []),
          ...(receivedPromisesRes.data || [])
        ] as PromiseData[];
        loadPromiseCreators(allPromises);
        loadPromiseRecipients(allPromises);
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

  if (isLoading || userLoading || !userData) {
    return (
      <>
        <Header />
        <div className="main-content">
          <div className="middle-sidebar-bottom">
            <div className="middle-sidebar-left pe-0">
              <div className="row">
                <div className="col-12">
                  <div className="text-center py-12">
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                      <span className="text-gray-600">{/* "Загрузка профиля..." */}{t('userProfile.loadingProfile')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Appfooter />
      </>
    );
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
                        firstName={userData.first_name || ''}
                        lastName={userData.last_name || ''}
                        about={userData.about}
                        isEditable={false}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
                
                {/* Кнопка "Загрузить еще" */}
                {!isLoading && hasMore && (
                  <div className="text-center my-4 pb-2">
                    <button
                      onClick={loadMorePosts}
                      className="btn btn-outline-primary px-4 py-2"
                    >
                      {t('userProfile.loadMore')}
                    </button>
                  </div>
                )}
                

              </div>
              <div className="col-xl-8 col-xxl-9 col-lg-8">
                <AnimatePresence>
                  {/* --- Изменено: используем displayedPosts вместо filteredPosts --- */}
                  {displayedPosts.map((post) =>
                    isPromiseData(post) ? (
                      <motion.div
                        key={post.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                      >
                        {/* --- Новый блок: получение данных о получателе для обещаний "кому-то" --- */}
                        {(() => {
                          let recipientName = '';
                          let recipientAvatarUrl = '';
                          if (post.recipient_id) {
                            // Если получатель - это владелец профиля
                            if (post.recipient_id === telegramId) {
                              recipientName = fullName;
                              recipientAvatarUrl = userData?.avatar_img_url || defaultAvatarImg;
                            } else {
                              // Для других получателей используем загруженные данные
                              const recipient = promiseRecipients[post.recipient_id];
                              if (recipient) {
                                recipientName = `${recipient.first_name} ${recipient.last_name}`.trim() || recipient.username || `@${post.recipient_id}`;
                                recipientAvatarUrl = recipient.avatar_img_url || '/assets/images/defaultAvatar.png';
                              } else {
                                // Если данные еще не загружены, показываем ID
                                recipientName = `@${post.recipient_id}`;
                                recipientAvatarUrl = '/assets/images/defaultAvatar.png';
                              }
                            }
                          }
                          return (
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
                              recipientName={recipientName}
                              recipientAvatarUrl={recipientAvatarUrl}
                              isList
                              isProfilePage
                            />
                          );
                        })()}
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
