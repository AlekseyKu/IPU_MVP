// frontend\src\components\PromiseCreate.tsx
'use client'

import React, { useState, useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'
import { useUser, useCreatePostModal } from '@/context/UserContext'
import { X, Image as ImageIcon } from 'lucide-react'
// import { supabase } from '@/lib/supabaseClient'
import { usePromiseApi } from '@/hooks/usePromiseApi'
import { addHashtag, removeHashtag, getRandomPopularHashtags, MAX_HASHTAGS } from '@/utils/hashtags';

const PromiseCreate: React.FC = () => {
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
  const [mediaType, setMediaType] = useState<string | null>(null);
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [hashtagInput, setHashtagInput] = useState('');
  const [randomPopular, setRandomPopular] = useState<string[]>([]);

  // Локальный updatePosts-заглушка, если компонент используется отдельно
  const updatePosts = () => {};
  const setError = (msg: string) => { console.error(msg); };
  const { handleCreate } = usePromiseApi(updatePosts, setError);

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

  useEffect(() => {
    if (!previewUrl) return;
    fetch(previewUrl, { method: 'HEAD' })
      .then((res) => {
        const type = res.headers.get('Content-Type');
        if (type) setMediaType(type);
      })
      .catch((err) => {
        console.error('Error determining media type:', err);
      });
  }, [previewUrl]);

  useEffect(() => {
    if (isCreatePostOpen) {
      setRandomPopular(getRandomPopularHashtags([], 6));
    }
  }, [isCreatePostOpen]);

  // --- Хештеги ---
  const handleHashtagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHashtagInput(e.target.value);
  };
  const handleHashtagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (["Enter", " ", ","].includes(e.key)) {
      e.preventDefault();
      if (hashtagInput.trim()) {
        setHashtags(prev => addHashtag(prev, hashtagInput));
        setHashtagInput('');
      }
    }
  };
  const handleRemoveHashtag = (tag: string) => {
    setHashtags(prev => removeHashtag(prev, tag));
  };
  const handlePopularHashtagClick = (tag: string) => {
    setHashtags(prev => addHashtag(prev, tag));
  };

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

      // Преобразуем deadline в UTC-строку
      const utcDeadline = new Date(deadline).toISOString();

      const created = await handleCreate({
        user_id: telegramId,
        title,
        deadline: utcDeadline,
        content,
        media_url: mediaUrl,
        is_public: isPublic,
        hashtags // <--- добавляем хештеги
      });
      if (created) setIsCreatePostOpen(false)
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
        paddingBottom: '2rem',
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
            {mediaType?.startsWith('video') ? (
              <video controls preload="none" className="w-100 rounded" style={{ maxHeight: '200px', objectFit: 'cover' }}>
                <source src={previewUrl} type={mediaType} />
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

          {/* --- Хештеги --- */}
          <div className="mb-2">
            <label className="text-muted form-label">Хештеги (до {MAX_HASHTAGS}):</label>
            <div className="mb-1">
              {hashtags.map(tag => (
                <span key={tag} className="badge bg-primary me-1 mb-1" >
                  #{tag}
                  <button type="button" onClick={() => handleRemoveHashtag(tag)} className="btn btn-outline-primary text-white px-1 py-0" tabIndex={-1}>&times;</button>
                </span>
              ))}
            </div>
            <input
              type="text"
              value={hashtagInput}
              onChange={handleHashtagInputChange}
              onKeyDown={handleHashtagKeyDown}
              placeholder="Введите хештег и нажмите Enter"
              className="form-control mb-1"
              disabled={hashtags.length >= MAX_HASHTAGS}
              maxLength={30}
            />
            <div className="mt-1">
              {/* <span className="text-muted font-xsss">Популярные:</span> */}
              {randomPopular.map(tag => (
                <button
                  key={tag}
                  type="button"
                  className="btn btn-sm"
                  onClick={() => handlePopularHashtagClick(tag)}
                  disabled={hashtags.length >= MAX_HASHTAGS}
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>

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

          <div className="d-flex w-100 gap-2">
            <button type="button" onClick={handleClose} className="btn btn-light w-50" disabled={loading}>
              Отмена
            </button>
            <button type="submit" className="btn btn-outline-primary w-50" disabled={loading}>
              {loading ? 'Сохранение...' : 'Создать'}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  )
}

export default PromiseCreate;
