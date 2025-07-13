'use client'

import React, { useState, useEffect, useRef } from 'react'
import { CirclePlay, CircleStop, Ellipsis, Globe, GlobeLock } from 'lucide-react'
import { createClient } from '@supabase/supabase-js'
import { PromiseData } from '@/types'

interface PostviewProps {
  promise: PromiseData
  onToggle: () => void
  isOpen: boolean
  onUpdate: (updatedPromise: PromiseData) => void
  onDelete: (id: string) => void
  isOwnProfile: boolean
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const Postview: React.FC<PostviewProps> = ({ promise, onToggle, isOpen, onUpdate, onDelete, isOwnProfile }) => {
  const { id, title, deadline, content, media_url, is_completed, created_at, is_public } = promise
  const [isMounted, setIsMounted] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [localPromise, setLocalPromise] = useState<PromiseData>(promise)
  const [isPlaying, setIsPlaying] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

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

    if (videoRef.current) {
      videoRef.current.pause()
      videoRef.current.currentTime = 0
      videoRef.current.controls = false
    }

    return () => {
      supabase.removeChannel(subscription)
    }
  }, [id, onUpdate])

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

  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.muted = false
      videoRef.current.controls = true
      videoRef.current.play().catch((error) => console.error('Error playing video:', error))
      setIsPlaying(true)
    }
  }

  const handlePause = () => {
    if (videoRef.current) {
      videoRef.current.pause()
      setIsPlaying(false)
    }
  }

  return (
    <div className="card w-100 shadow-sm rounded-xxl border-0 p-3 mb-3 position-relative" onClick={onToggle}>
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
            <div className="mb-3 position-relative" onClick={(e) => e.stopPropagation()}>
              {media_url.endsWith('.mp4') || media_url.endsWith('.mov') ? (
                <div>
                  {!isPlaying && (
                    <button
                      onClick={handlePlay}
                      className="position-absolute top-50 start-50 translate-middle btn btn-primary rounded-circle p-2"
                      style={{ transform: 'translate(-50%, -50%)', zIndex: 1 }}
                    >
                      <CirclePlay className="w-6 h-6" />
                    </button>
                  )}
                  <video
                    ref={videoRef}
                    className="w-100 rounded"
                    autoPlay={false}
                    muted={false}
                    controls={false}
                    playsInline
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                  >
                    <source src={media_url} type={media_url.endsWith('.mp4') ? 'video/mp4' : 'video/quicktime'} />
                  </video>
                </div>
              ) : (
                <img src={media_url} alt="Attached media" className="w-100 rounded" />
              )}
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

          <div className="position-absolute bottom-0 end-0 mb-3 me-4">
            <Ellipsis
              className="cursor-pointer text-muted"
              size={20}
              onClick={(e) => {
                e.stopPropagation()
                setMenuOpen(!menuOpen)
              }}
            />
            {menuOpen && (
              <div className="dropdown-menu show p-2 bg-white font-xsss border rounded shadow-sm position-absolute end-0 mt-1">
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

export default Postview
