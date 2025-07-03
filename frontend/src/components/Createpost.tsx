// frontend\src\components\Createpost.tsx
'use client'

import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import { useCreatePostModal } from '@/context/UserContext'
import { X, Image as ImageIcon } from 'lucide-react'

const Createpost: React.FC = () => {
  const { isCreatePostOpen, setIsCreatePostOpen } = useCreatePostModal()
  const [title, setTitle] = useState('')
  const [deadline, setDeadline] = useState('')
  const [content, setContent] = useState('')
  const [media, setMedia] = useState<File | null>(null)

  useEffect(() => {
    if (isCreatePostOpen) {
      setTitle('')
      setDeadline('')
      setContent('')
      setMedia(null)
    }
  }, [isCreatePostOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log({ title, deadline, content, media })
    setIsCreatePostOpen(false)
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
          />
          <input
            type="datetime-local"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="form-control mb-3"
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Введите текст обещания"
            className="form-control mb-3"
            style={{ height: '200px' }}
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
            <button type="button" onClick={handleClose} className="btn btn-light">
              Отмена
            </button>
            <button type="submit" className="btn btn-primary">
              Создать
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  )
}

export default Createpost
