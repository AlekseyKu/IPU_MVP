// frontend/src/components/Postview.tsx
'use client'

import React, { useState, useEffect, useRef } from 'react'
import { CirclePlay, CircleStop, Ellipsis, CircleEllipsis, Globe, GlobeLock } from 'lucide-react'
import { createClient } from '@supabase/supabase-js'
import { PromiseData } from '@/types'
import videojs from 'video.js'
import 'video.js/dist/video-js.css'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface PostviewProps {
  promise: PromiseData
  onToggle: () => void
  isOpen: boolean
  onUpdate: (updatedPromise: PromiseData) => void
  onDelete: (id: string) => void
  isOwnProfile: boolean
  isList?: boolean
  avatarUrl?: string
  userId?: number
  userName?: string
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const Postview: React.FC<PostviewProps> = ({ promise, onToggle, isOpen, onUpdate, onDelete, isOwnProfile, isList = false, avatarUrl, userId, userName }) => {
  const { id, title, deadline, content, media_url, is_completed, created_at, is_public } = promise
  const [isMounted, setIsMounted] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [localPromise, setLocalPromise] = useState<PromiseData>(promise)
  const router = useRouter()

  const videoNode = useRef<HTMLVideoElement | null>(null)
  const playerRef = useRef<ReturnType<typeof videojs> | null>(null)

  useEffect(() => {
    setIsMounted(true)

    if (!id) {
      console.error('Promise ID is undefined')
      return
    }

    const subscription = supabase
      .channel(`promise-update-${id}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'promises', filter: `id=eq.${id}` },
        (payload) => {
          const updatedPromise = payload.new as PromiseData
          setLocalPromise(updatedPromise)
          if (onUpdate) onUpdate(updatedPromise)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(subscription)
    }
  }, [id, onUpdate])

  useEffect(() => {
    if (videoNode.current && media_url) {
      playerRef.current = videojs(videoNode.current, {
        controls: true,
        autoplay: false,
        muted: false,
        preload: 'metadata',
        playsinline: true,
        fluid: true,
        sources: [
          {
            src: media_url,
            type: media_url.endsWith('.mp4') ? 'video/mp4' : 'video/quicktime',
          },
        ],
      })

      return () => {
        playerRef.current?.dispose()
        playerRef.current = null
      }
    }
  }, [media_url])

  if (!isMounted) return null
  if (!localPromise) return <div className="text-center p-2">Данные не загружены</div>

  const statusText = localPromise.is_completed ? 'Завершено' : 'Активно'
  const Icon = localPromise.is_completed ? CircleStop : CirclePlay
  const iconColor = localPromise.is_completed ? 'text-accent' : 'text-primary'
  const PublicIcon = localPromise.is_public ? Globe : GlobeLock
  const publicText = localPromise.is_public ? 'Публичное' : 'Личное'

  const handleComplete = async () => {
    if (!id || !isOwnProfile) return
    const { error } = await supabase
      .from('promises')
      .update({ is_completed: true })
      .eq('id', id)
    if (error) console.error('Error completing promise:', error)
    setMenuOpen(false)
  }

  const copyLink = () => {
    if (!id) return
    const link = `${window.location.origin}/promise/${id}`
    navigator.clipboard.writeText(link).then(() => alert('Ссылка скопирована!'))
    setMenuOpen(false)
  }

  const share = () => {
    if (!id) return
    const shareData = {
      title: localPromise.title,
      text: localPromise.content,
      url: `${window.location.origin}/promise/${id}`,
    }
    if (navigator.share) {
      navigator.share(shareData).catch((error) => console.error('Error sharing:', error))
    } else {
      alert('Поделиться недоступно на этом устройстве')
    }
    setMenuOpen(false)
  }

  const handleDelete = async () => {
    if (!id || !isOwnProfile) return
    if (confirm('Вы уверены, что хотите удалить это обещание?')) {
      const { error } = await supabase
        .from('promises')
        .delete()
        .eq('id', id)
      if (error) {
        console.error('Error deleting promise:', error)
      } else {
        setMenuOpen(false)
        if (onDelete) onDelete(id)
      }
    }
  }

  return (
    <div className="card w-100 shadow-sm rounded-xxl border-0 p-3 mb-3 position-relative" onClick={onToggle}>
      {isList && userId && (
        <div className="d-flex align-items-center mb-2">
          <Link href={`/profile/${userId}`} onClick={(e) => e.stopPropagation()}>
            <img
              src={avatarUrl || '/assets/images/defaultAvatar.png'}
              alt="avatar"
              width={32}
              height={32}
              className="rounded-circle me-2"
            />
          </Link>
          <span className="text-dark font-xsss">{userName || 'Guest'}</span>
          
        </div>
      )}
      <div className="card-body p-0 d-flex flex-column">
        <div className="flex-grow-1">
          <span className="text-dark font-xs mb-1">{title}</span>
          {isOwnProfile && (
            <div className="d-flex justify-content-end align-items-center mb-1">
              <span className="text-muted font-xssss me-1">{publicText}</span>
              <PublicIcon className="w-2 h-2 text-muted" />
            </div>
          )}
        </div>
        <div className="d-flex justify-content-between align-items-center">
          <span className="text-muted font-xsss">
            Дэдлайн: {new Date(deadline).toLocaleString([], {
              year: '2-digit',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
              hour12: false,
            })}
          </span>
          <div className="d-flex align-items-center text-nowrap">
            <span className="text-muted font-xssss me-1">{statusText}</span>
            <Icon className={`w-2 h-2 ${iconColor}`} />
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="mt-3">
          <p className="text-muted lh-sm small mb-2">{content}</p>
          {media_url && (
            <div className="mb-3" onClick={(e) => e.stopPropagation()}>
              <video
                src={media_url}
                controls
                preload="metadata"
                className="w-100 rounded"
                style={{ backgroundColor: '#000' }}
              />
            </div>
          )}

          <span className="text-muted small">Создано: {new Date(created_at).toLocaleString([], {
            year: '2-digit',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          })}</span>

          <div className="position-absolute bottom-0 end-0 mb-3 me-3">
            <Ellipsis
              className="cursor-pointer text-muted"
              size={24}
              onClick={(e) => {
                e.stopPropagation()
                setMenuOpen(!menuOpen)
              }}
            />
            {menuOpen && (
              <div className="dropdown-menu show p-2 bg-white font-xsss border rounded shadow-sm position-absolute end-0 mt-1">
                {isList && !isOwnProfile && (
                  <button className="dropdown-item" onClick={() => router.push(`/profile/${userId}`)}>
                    Посмотреть профиль
                  </button>
                )}
                {isOwnProfile && !localPromise.is_completed && (
                  <button className="dropdown-item text-accent" onClick={handleComplete}>
                    Завершить обещание
                  </button>
                )}
                <button className="dropdown-item" onClick={copyLink}>
                  Скопировать ссылку
                </button>
                <button className="dropdown-item" onClick={share}>
                  Отправить
                </button>
                {isOwnProfile && (
                  <button className="dropdown-item text-danger" onClick={handleDelete}>
                    Удалить обещание
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
// рабочий вариант. Chrome - привью видео есть, iOS - нет.
export default Postview