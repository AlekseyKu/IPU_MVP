// frontend/src/app/user/[telegramId]/page.tsx
'use client'

import { useState, useEffect, useMemo } from 'react'
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
import { UserData, PromiseData, ChallengeData, PostData } from '@/types'
import { useUserData } from '@/hooks/useUserData'
import usePromiseActions from '@/hooks/usePromiseActions'
import { usePromiseApi } from '@/hooks/usePromiseApi';

// type guards
function isPromiseData(post: PostData): post is PromiseData {
  return 'is_completed' in post && 'deadline' in post
}

function isChallengeData(post: PostData): post is ChallengeData {
  return 'frequency' in post && 'total_reports' in post && 'completed_reports' in post
}

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
  const [localUser, setLocalUser] = useState<UserData | null>(null)

  const { userData, isLoading: userLoading, defaultHeroImg, defaultAvatarImg } = useUserData(telegramId)
  const isOwn = ctxId === telegramId

  const updatePosts = (
    post: PromiseData | ChallengeData,
    eventType: 'INSERT' | 'UPDATE' | 'DELETE'
  ) => {
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

  const { handleSubscribe } = usePromiseActions(
    telegramId,
    setLocalUser,
    setError
  )

  const { handleDelete, handleUpdate } = usePromiseApi(updatePosts, setError);

  useEffect(() => {
    if (userData) setLocalUser(userData)
  }, [userData])

  useEffect(() => {
    if (!telegramId || isNaN(telegramId)) {
      setError('Invalid telegramId')
      setIsLoading(false)
      return
    }
    setIsLoading(true)
    setTelegramId(telegramId)

    Promise.all([
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
    ])
      .then(([pRes, cRes]) => {
        if (pRes.error) throw pRes.error
        if (cRes.error) throw cRes.error

        const merged = [
          ...(pRes.data || []),
          ...(cRes.data || []),
        ].sort(
          (a, b) =>
            new Date(b.created_at).getTime() -
            new Date(a.created_at).getTime()
        )
        setAllPosts(merged)
      })
      .catch((err) => {
        console.error(err)
        setError('General error occurred')
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [paramId, ctxId])

  useEffect(() => {
    if (!telegramId) return

    const channel = supabase
      .channel(`posts-${telegramId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'promises', filter: `user_id=eq.${telegramId}` },
        (payload) => updatePosts(payload.new as PromiseData, 'INSERT')
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'promises', filter: `user_id=eq.${telegramId}` },
        (payload) => updatePosts(payload.new as PromiseData, 'UPDATE')
      )
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'promises', filter: `user_id=eq.${telegramId}` },
        (payload) => updatePosts(payload.old as PromiseData, 'DELETE')
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'challenges', filter: `user_id=eq.${telegramId}` },
        (payload) => updatePosts(payload.new as ChallengeData, 'INSERT')
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'challenges', filter: `user_id=eq.${telegramId}` },
        (payload) => updatePosts(payload.new as ChallengeData, 'UPDATE')
      )
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'challenges', filter: `user_id=eq.${telegramId}` },
        (payload) => updatePosts(payload.old as ChallengeData, 'DELETE')
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [telegramId])

  const handleChallengeUpdate = (updated: ChallengeData) => {
    updatePosts(updated, 'UPDATE')
  }

  if (isLoading || userLoading || !localUser) {
    return <Load />
  }

  const fullName = `${localUser.first_name} ${localUser.last_name}`.trim()
  const promisesCount = allPosts.filter(isPromiseData).length
  const promisesDone = allPosts.filter((p) => isPromiseData(p) && p.is_completed).length
  const challengesCount = allPosts.filter(isChallengeData).length
  const challengesDone = allPosts.filter(
    (p) =>
      isChallengeData(p) &&
      p.completed_reports === p.total_reports
  ).length

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
                  username={localUser.username || ''}
                  firstName={localUser.first_name || ''}
                  lastName={localUser.last_name || ''}
                  telegramId={localUser.telegram_id}
                  subscribers={localUser.subscribers || 0}
                  promises={promisesCount + challengesCount}
                  promisesDone={promisesDone + challengesDone}
                  stars={localUser.stars || 0}
                  heroImgUrl={localUser.hero_img_url || defaultHeroImg}
                  avatarUrl={localUser.avatar_img_url || defaultAvatarImg}
                  isEditable={false}
                  isOwnProfile={isOwn}
                  onSubscribe={handleSubscribe}
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
                        username={localUser.username || ''}
                        telegramId={localUser.telegram_id}
                        fullName={fullName}
                        about={localUser.about}
                        isEditable={false}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <div className="col-xl-8 col-xxl-9 col-lg-8">
                <AnimatePresence>
                  {allPosts.map((post) =>
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
                          avatarUrl={localUser.avatar_img_url || defaultAvatarImg}
                          userId={telegramId}
                          userName={fullName}
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
                          challenge={post}
                          onToggle={() =>
                            setOpenPostId(openPostId === post.id ? null : post.id)
                          }
                          isOpen={openPostId === post.id}
                          onUpdate={handleChallengeUpdate}
                          onDelete={handleDelete}
                          isOwnProfile={isOwn}
                          avatarUrl={localUser.avatar_img_url || defaultAvatarImg}
                          userId={telegramId}
                          userName={fullName}
                          isList
                          isProfilePage
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
