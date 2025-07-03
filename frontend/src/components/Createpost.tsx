// frontend/src/components/Createpost.tsx
'use client'

import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import { useCreatePostModal } from '@/context/UserContext'
import { X, Image as ImageIcon } from 'lucide-react'
import { createClient } from '@supabase/supabase-js'
import { useUser } from '@/context/UserContext'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const Createpost: React.FC = () => {
  const { isCreatePostOpen, setIsCreatePostOpen } = useCreatePostModal()
  const { telegramId } = useUser()
  const [title, setTitle] = useState('')
  const [deadline, setDeadline] = useState('')
  const [content, setContent] = useState('')
  const [media, setMedia] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isCreatePostOpen) {
      setTitle('')
      setDeadline('')
      setContent('')
      setMedia(null)
    }
  }, [isCreatePostOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!telegramId) return

    setLoading(true)
    try {
      let mediaUrl = null
      if (media) {
        const fileExt = media.name.split('.').pop()
        const fileName = `${Date.now()}.${fileExt}`
        const { error: uploadError } = await supabase.storage
          .from('promises-media')
          .upload(`public/${fileName}`, media, {
            upsert: true
          })
        if (uploadError) throw uploadError
        mediaUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/promises-media/public/${fileName}`
      }

      const { error } = await supabase.from('promises').insert({
        user_id: telegramId,
        title,
        deadline,
        content,
        media_url: mediaUrl,
        created_at: new Date().toISOString(),
        is_completed: false // Устанавливаем по умолчанию как "не выполнено"
      })

      if (error) throw error
      setIsCreatePostOpen(false)
    } catch (error) {
      console.error('Error saving promise:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setMedia(e.target.files[0])
    }
  }

  const handleClose = () => {
    setIsCreatePostOpen(false)
  }

  if (!isCreatePostOpen || typeof window === 'undefined') return null

  return ReactDOM.createPortal(
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflowY: 'auto',
        padding: '1rem',
        opacity: 1,
        animation: 'fadeIn 0.3s ease-out',
      }}
    >
      <div
        className="card shadow-xss rounded-xxl border-0 p-4 bg-white w-100"
        style={{
          maxWidth: '500px',
          position: 'relative',
          maxHeight: 'calc(100vh - 2rem)',
          overflowY: 'auto',
          transform: 'translateY(20px)',
          animation: 'popupSlideIn 0.3s ease-out',
        }}
      >
        <button
          onClick={handleClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'none',
            border: 'none',
          }}
        >
          <X className="w-6 h-6" />
        </button>
        <h2 className="fw-bold mb-3">Создать обещание</h2>
        <p className="text-muted mb-3">Опишите свое обещание и установите дедлайн при необходимости</p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Название обещания"
            className="form-control mb-3"
            required
          />
          <input
            type="datetime-local"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="form-control mb-3"
            required
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Введите текст обещания"
            className="form-control mb-3"
            style={{ height: '200px' }}
            required
          />
          <div className="mb-3">
            <label className="btn btn-outline-secondary w-100 d-flex align-items-center justify-content-center">
              <input
                type="file"
                accept="image/*,video/*"
                onChange={handleFileChange}
                className="d-none"
              />
              <ImageIcon className="me-2" />
              Прикрепить фото/видео
            </label>
            {media && <div className="small mt-2">{media.name}</div>}
          </div>
          <div className="d-flex justify-content-end gap-2">
            <button type="button" onClick={handleClose} className="btn btn-light" disabled={loading}>
              Отмена
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Сохранение...' : 'Создать'}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  )
}

export default Createpost