// frontend\src\components\PromiseView.tsx
'use client'

// --- Импорты ---
import React, { useState, useRef, useEffect } from 'react';
import { CirclePlay, CircleStop, Ellipsis, Globe, GlobeLock } from 'lucide-react';
import { PromiseData } from '@/types';
import { formatDateTime } from '@/utils/formatDate';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import PromiseCompleteModal from './PromiseCompleteModal';
import { usePromiseApi } from '@/hooks/usePromiseApi';
import PromiseResultModal from './PromiseResultModal';

// --- Типы ---
interface PostviewProps {
  promise: PromiseData;
  onToggle: () => void;
  onUpdate: (updatedPromise: PromiseData) => void;
  onDelete: (id: string) => void;
  isOpen: boolean;
  isOwnProfile: boolean;
  isList?: boolean;
  isProfilePage?: boolean;
  avatarUrl?: string;
  userId?: number;
  userName?: string;
}

// --- Основной компонент ---
const PromiseView: React.FC<PostviewProps> = ({
  promise,
  onToggle,
  onUpdate,
  onDelete,
  isOpen,
  isOwnProfile,
  isList = false,
  isProfilePage = false,
  avatarUrl,
  userId,
  userName
}) => {
  // --- Состояния и хуки ---
  const { id, title, deadline, content, media_url, is_completed, created_at, is_public } = promise;
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [mediaType, setMediaType] = useState<string | null>(null);
  const router = useRouter();
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const [completeLoading, setCompleteLoading] = useState(false);
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);
  // --- usePromiseApi ---
  const updatePosts = (post: PromiseData, eventType: 'INSERT' | 'UPDATE' | 'DELETE') => { if (eventType === 'UPDATE') onUpdate(post); };
  const setError = (msg: string) => { console.error(msg); };
  const { handleCompletePromise } = usePromiseApi(updatePosts, setError);

  // --- Логика статуса и иконки ---
  const statusText = is_completed ? 'Завершено' : 'Активно';
  const Icon = is_completed ? CircleStop : CirclePlay;
  const iconColor = is_completed ? 'text-grey' : 'text-primary';
  // const PublicIcon = is_public ? Globe : GlobeLock;

  // --- Проверка дедлайна ---
  const isDeadlineActive = (() => {
    if (!deadline) return false;
    const today = new Date();
    const deadlineDate = new Date(deadline);
    // Кнопка активна, если сегодня не позже дедлайна (включительно)
    // TODO кнопка активна не ранее 6ч от даты старт (created_at)
    return today.setHours(0,0,0,0) <= deadlineDate.setHours(0,0,0,0);
  })();

  // --- Обработчики ---
  const handleComplete = () => {
    setIsCompleteModalOpen(true);
  };

  const handleCompleteSubmit = async (resultText: string, file: File | null) => {
    setCompleteLoading(true);
    try {
      let result_media_url = null;
      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('telegramId', String(promise.user_id));
        const response = await fetch('/api/promises/upload', {
          method: 'POST',
          body: formData,
        });
        if (!response.ok) throw new Error('Ошибка загрузки файла');
        const data = await response.json();
        result_media_url
        result_media_url = data.url;
      }
      // Завершаем обещание через handleCompletePromise
      const updated = await handleCompletePromise(
        promise.id,
        resultText,
        result_media_url
      );
      if (updated) {
        setIsCompleteModalOpen(false);
        // onUpdate(updated); // updatePosts уже вызывает onUpdate
      }
    } catch (error) {
      alert('Ошибка при завершении обещания');
      console.error(error);
    } finally {
      setCompleteLoading(false);
    }
  };

  const handleDelete = () => {
    if (!id || !isOwnProfile) return;
    if (confirm('Вы уверены, что хотите удалить это обещание?')) {
      onDelete(id);
      setMenuOpen(false);
    }
  };

  const copyLink = () => {
    const link = `${window.location.origin}/promise/${id}`;
    navigator.clipboard.writeText(link).then(() => alert('Ссылка скопирована!'));
    setMenuOpen(false);
  };

  const share = () => {
    const shareData = {
      title: promise.title,
      text: promise.content,
      url: `${window.location.origin}/promise/${id}`,
    };
    if (navigator.share) {
      navigator.share(shareData).catch((error) => console.error('Error sharing:', error));
    } else {
      alert('Поделиться недоступно на этом устройстве');
    }
    setMenuOpen(false);
  };

  // --- Закрытие меню при клике вне него ---
  useEffect(() => {
    if (!menuOpen) return;
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

  // --- Определение типа медиа ---
  useEffect(() => {
    if (!media_url) return;
    fetch(media_url, { method: 'HEAD' })
      .then((res) => {
        const type = res.headers.get('Content-Type');
        if (type) setMediaType(type);
      })
      .catch((err) => {
        console.error('Error determining media type:', err);
      });
  }, [media_url]);

  

  // --- JSX ---
  return (
    <div className="card w-100 shadow-sm rounded-xxl border-0 p-3 mb-3 position-relative" onClick={onToggle}>
      {/* --- Заголовок и аватар --- */}
      {isList && userId && (
        <div className="d-flex align-items-center mb-2">
          <Link href={isOwnProfile ? `/user/${userId}` : `/profile/${userId}`} onClick={(e) => e.stopPropagation()}>
            <img 
              src={avatarUrl || '/assets/images/defaultAvatar.png'} 
              alt="avatar" 
              width={32} 
              height={32} 
              className="rounded-circle me-2"
              style={{ objectFit: 'cover' }}
            />
          </Link>
          <span className="text-dark font-xsss">{userName || 'Guest'}</span>
        </div>
      )}

      {/* --- Основная информация --- */}
      <div className="card-body p-0 d-flex flex-column">
        <div className="flex-grow-1">
          <span className="text-dark font-xs mb-1">{title}</span>
          {isOwnProfile && isProfilePage && (
            <div className="d-flex justify-content-end align-items-center mb-1">
              {!is_public && (
                <>
                  <span className="text-muted font-xssss me-1">Личное</span>
                  <GlobeLock className="w-2 h-2 text-muted" />
                </>
              )}
            </div>
          )}
        </div>
        <div className="d-flex justify-content-between align-items-center">
          <span className="text-muted font-xsss">
            Дэдлайн: {formatDateTime(deadline)}
          </span>
          <div className="d-flex align-items-center text-nowrap">
            <span className="text-muted font-xssss me-1">{statusText}</span>
            <Icon className={`w-2 h-2 ${iconColor}`} />
          </div>
        </div>
      </div>

      {/* --- Детали обещания --- */}
      {isOpen && (
        <div className="mt-3" onClick={(e) => e.stopPropagation()}>
          <p className="text-muted lh-sm small mb-2">{content}</p>
          {media_url && (
            <div className="mb-3">
              {mediaType?.startsWith('video') ? (
                <video src={media_url} controls className="w-100 rounded" style={{ backgroundColor: '#000' }} />
              ) : (
                <img src={media_url} alt="media" className="w-100 rounded" style={{ objectFit: 'cover' }} />
              )}
            </div>
          )}
          {/* --- Кнопка Завершить или Результат --- */}
          {isOwnProfile && isProfilePage && !is_completed && (
            <div className="d-flex justify-content-center py-2">
              <button
                className="btn w-50 btn-outline-primary"
                onClick={handleComplete}
                disabled={!isDeadlineActive}
              >
                Завершить
              </button>
            </div>
          )}
          {is_completed && (
            <div className="d-flex justify-content-center py-2">
              <button
                className="btn w-50 btn-outline-primary"
                onClick={() => setIsResultModalOpen(true)}
              >
                Результат
              </button>
            </div>
          )}
          {isCompleteModalOpen && (
            <PromiseCompleteModal
              onClose={() => setIsCompleteModalOpen(false)}
              onSubmit={handleCompleteSubmit}
              loading={completeLoading}
            />
          )}
          {isResultModalOpen && (
            <PromiseResultModal
              onClose={() => setIsResultModalOpen(false)}
              result_content={promise.result_content}
              result_media_url={promise.result_media_url}
              completed_at={promise.completed_at}
            />
          )}
          <span className="text-muted small">Создано: {formatDateTime(created_at)}</span>

          {/* --- Меню --- */}
          <div ref={menuRef} className="position-absolute top-0 end-0 mt-3 me-3">
            <Ellipsis
              className="cursor-pointer text-muted"
              size={24}
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen(!menuOpen);
              }}
            />
            {menuOpen && (
              <div className="dropdown-menu show p-2 bg-white font-xsss border rounded shadow-sm position-absolute end-0 mt-1">
                {isList && !isOwnProfile && (
                  <button 
                    className="dropdown-item" 
                    onClick={() => router.push(isOwnProfile ? `/user/${userId}` : `/profile/${userId}`)}
                  >
                    Посмотреть профиль
                  </button>
                )}
                {/* {isOwnProfile && isProfilePage && !is_completed && (
                  <button className="dropdown-item text-accent" onClick={handleComplete}>
                    Завершить обещание
                  </button>
                )} */}
                <button className="dropdown-item" onClick={copyLink}>Скопировать ссылку</button>
                <button className="dropdown-item" onClick={share}>Отправить</button>
                {isOwnProfile && isProfilePage && (
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
  );
};

export default PromiseView;