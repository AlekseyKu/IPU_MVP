// frontend\src\components\Createpost.tsx
'use client'

import React, { useState, useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'
import { useUser, useCreatePostModal } from '@/context/UserContext'
import { X, Image as ImageIcon } from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'

const Createpost: React.FC = () => {
  const { isCreatePostOpen, setIsCreatePostOpen } = useCreatePostModal()
  const { telegramId } = useUser()
  const [title, setTitle] = useState('')
  const [deadline, setDeadline] = useState('')
  const [content, setContent] = useState('')
  const [media, setMedia] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [isPublic, setIsPublic] = useState(true)
  const [deadlineError, setDeadlineError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isCreatePostOpen) {
      setTitle('')
      setDeadline('')
      setContent('')
      setMedia(null)
      setPreviewUrl(null)
      setIsPublic(true)
      setDeadlineError(null)
    }
  }, [isCreatePostOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!telegramId) return

    const now = new Date()
    if (new Date(deadline) <= now) {
      setDeadlineError('Дедлайн должен быть в будущем.')
      return
    }

    setDeadlineError(null)
    setLoading(true)
    try {
      let mediaUrl = null
      if (media) {
        const formData = new FormData()
        formData.append('file', media)
        formData.append('telegramId', telegramId.toString())
        const response = await fetch('/api/promises/upload', {
          method: 'POST',
          body: formData,
        })
        if (!response.ok) throw new Error('Upload failed')
        const data = await response.json()
        mediaUrl = data.url
      }

      const { error } = await supabase.from('promises').insert({
        user_id: telegramId,
        title,
        deadline,
        content,
        media_url: mediaUrl,
        created_at: new Date().toISOString(),
        is_completed: false,
        is_public: isPublic
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
      const file = e.target.files[0]
      setMedia(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  const handleRemoveMedia = () => {
    setMedia(null)
    setPreviewUrl(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
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

        {previewUrl && (
          <div className="mb-2 position-relative">
            {previewUrl.endsWith('.mp4') ? (
              <video controls className="w-100 rounded" style={{ maxHeight: '200px', objectFit: 'cover' }}>
                <source src={previewUrl} type="video/mp4" />
              </video>
            ) : (
              <img src={previewUrl} alt="Preview" className="w-100 rounded" style={{ maxHeight: '200px', objectFit: 'cover' }} />
            )}
            <button
              onClick={handleRemoveMedia}
              className="btn btn-sm btn-danger position-absolute"
              style={{ top: '5px', right: '5px' }}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Название обещания"
            className="form-control mb-2"
            required
          />

          <div className="form-check form-switch mb-2">
            <input
              type="checkbox"
              className="form-check-input"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              id="isPublic"
            />
            <label className="form-check-label font-xsss" htmlFor="isPublic">
              {isPublic ? 'Публичное' : 'Личное'}
            </label>
          </div>

          <input
            type="datetime-local"
            value={deadline}
            onChange={(e) => {
              setDeadline(e.target.value)
              setDeadlineError(null)
            }}
            className="form-control mb-2"
            required
          />
          {deadlineError && (
            <div className="text-danger font-xsss mb-2">
              {deadlineError}
            </div>
          )}

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Введите текст обещания"
            className="form-control mb-3 lh-30"
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
                ref={fileInputRef}
              />
              <ImageIcon className="me-2" />
              Прикрепить фото/видео
            </label>
          </div>

          <div className="d-flex justify-content-end gap-2">
            <button type="button" onClick={handleClose} className="btn btn-light" disabled={loading}>
              Отмена
            </button>
            <button type="submit" className="btn btn-outline-primary" disabled={loading}>
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
