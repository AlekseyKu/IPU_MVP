// frontend\src\components\PromiseView.tsx
'use client'

// --- Импорты ---
import React, { useState, useRef, useEffect } from 'react';
import { CirclePlay, CircleStop, Ellipsis, Globe, GlobeLock, MoveRight, Send } from 'lucide-react';
import { PromiseData } from '@/types';
import { formatDateTime } from '@/utils/formatDate';
import { canDeleteItem, canCompletePromise, getTimeUntilCompletionAllowed } from '@/utils/postRules';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import PromiseCompleteModal from './PromiseCompleteModal';
import PromiseCompleteForRecipientModal from './PromiseCompleteForRecipientModal';
import { usePromiseApi } from '@/hooks/usePromiseApi';
import PromiseResultModal from './PromiseResultModal';
import LikeButton from './LikeButton';

// --- Типы ---
interface PostviewProps {
  promise: PromiseData;
  onToggle: () => void;
  onUpdate: (updatedPromise: PromiseData) => void;
  onDelete: (id: string) => void;
  isOpen: boolean;
  isOwnProfile: boolean;
  isOwnCreator?: boolean; // --- Новый проп для создателя ---
  isList?: boolean;
  isProfilePage?: boolean;
  avatarUrl?: string;
  userId?: number;
  userCtxId?: number; // --- Новый проп для ID текущего пользователя ---
  userName?: string;
  recipientName?: string; // --- Новый проп для имени получателя ---
  recipientAvatarUrl?: string; // --- Новый проп для аватара получателя ---
}

// --- Основной компонент ---
const PromiseView: React.FC<PostviewProps> = ({
  promise,
  onToggle,
  onUpdate,
  onDelete,
  isOpen,
  isOwnProfile,
  isOwnCreator,
  isList = false,
  isProfilePage = false,
  avatarUrl,
  userId,
  userCtxId,
  userName,
  recipientName,
  recipientAvatarUrl
}) => {
  // --- Состояния и хуки ---
  const { id, title, deadline, content, media_url, is_completed, created_at, is_public } = promise;
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [mediaType, setMediaType] = useState<string | null>(null);
  const router = useRouter();
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const [isCompleteForRecipientModalOpen, setIsCompleteForRecipientModalOpen] = useState(false);
  const [completeLoading, setCompleteLoading] = useState(false);
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);
  // --- usePromiseApi ---
  const updatePosts = (post: PromiseData, eventType: 'INSERT' | 'UPDATE' | 'DELETE') => { if (eventType === 'UPDATE') onUpdate(post); };
  const setError = (msg: string) => { console.error(msg); };
  const { handleCompletePromise } = usePromiseApi(updatePosts, setError);

  // --- Состояние для тултипа ---
  const [showTooltip, setShowTooltip] = useState(false);

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
    // И прошло минимум 3 часа с момента создания
    return today.setHours(0,0,0,0) <= deadlineDate.setHours(0,0,0,0) && canCompletePromise(created_at);
  })();

  // --- Новый блок: определение обещания "кому-то" ---
  const isToSomeone = !!promise.requires_accept && !!promise.recipient_id;
  const isRecipient = isToSomeone && userCtxId === promise.recipient_id;
  const isCreator = isToSomeone && userCtxId === promise.user_id;
  // --- Новый блок: состояния для кнопок ---
  const [actionLoading, setActionLoading] = useState(false);

  // --- Обработчики ---
  const handleComplete = () => {
    // Проверяем время создания (3 часа)
    if (!canCompletePromise(created_at)) {
      setShowTooltip(!showTooltip);
      return;
    }
    
    // Проверяем дедлайн
    if (!isDeadlineActive) {
      setShowTooltip(!showTooltip);
      return;
    }
    
    setIsCompleteModalOpen(true);
  };

  const handleCompleteForRecipient = () => {
    setIsCompleteForRecipientModalOpen(true);
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

  const handleCompleteForRecipientSubmit = async (resultText: string, file: File | null) => {
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
        result_media_url = data.url;
      }
      // Отправляем отчет через handleCompleteByCreator
      const res = await fetch('/api/promises/recipient/complete', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          promise_id: promise.id, 
          user_id: userCtxId,
          result_content: resultText,
          result_media_url: result_media_url
        })
      });
      if (res.ok) {
        onUpdate({ 
          ...promise, 
          is_completed_by_creator: true,
          result_content: resultText,
          result_media_url: result_media_url
        });
        setIsCompleteForRecipientModalOpen(false);
      }
    } catch (error) {
      alert('Ошибка при отправке отчета');
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

  // --- Новый блок: обработчики для новых API-роутов ---
  const handleAccept = async () => {
    setActionLoading(true);
    try {
      const res = await fetch('/api/promises/recipient/accept', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ promise_id: promise.id, user_id: userCtxId })
      });
      if (res.ok) onUpdate({ ...promise, is_accepted: true });
    } finally { setActionLoading(false); }
  };
  const handleDecline = async () => {
    setActionLoading(true);
    try {
      const res = await fetch('/api/promises/recipient/decline', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ promise_id: promise.id, user_id: userCtxId })
      });
      if (res.ok) onUpdate({ ...promise, is_accepted: false });
    } finally { setActionLoading(false); }
  };
  const handleCompleteByCreator = async () => {
    setActionLoading(true);
    try {
      const res = await fetch('/api/promises/recipient/complete', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ promise_id: promise.id, user_id: userCtxId })
      });
      if (res.ok) onUpdate({ ...promise, is_completed_by_creator: true });
    } finally { setActionLoading(false); }
  };
  const handleConfirmComplete = async () => {
    setActionLoading(true);
    try {
      const res = await fetch('/api/promises/recipient/confirm-complete', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ promise_id: promise.id, user_id: userCtxId })
      });
      if (res.ok) onUpdate({ ...promise, is_completed_by_recipient: true, is_completed: true });
    } finally { setActionLoading(false); }
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

  // --- Закрытие тултипа при клике вне его ---
  useEffect(() => {
    if (!showTooltip) return;
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Element;
      if (!target.closest('.tooltip-container')) {
        setShowTooltip(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showTooltip]);

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
          <Link href={userCtxId === userId ? `/user/${userId}` : `/profile/${userId}`} onClick={(e) => e.stopPropagation()}>
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
          
          {/* --- Новый блок: отображение получателя для обещаний "кому-то" --- */}
          {isToSomeone && recipientName && (
            <>
              <MoveRight className="w-3 h-3 text-muted mx-2" />
              <div className="d-flex align-items-center pe-4">
                  <Link href={userCtxId === promise.recipient_id ? `/user/${promise.recipient_id}` : `/profile/${promise.recipient_id}`} onClick={(e) => e.stopPropagation()}>
                   <img 
                     src={recipientAvatarUrl || '/assets/images/defaultAvatar.png'} 
                     alt="recipient avatar" 
                     width={32} 
                     height={32} 
                     className="rounded-circle me-2"
                     style={{ objectFit: 'cover' }}
                   />
                 </Link>
                 <Link href={userCtxId === promise.recipient_id ? `/user/${promise.recipient_id}` : `/profile/${promise.recipient_id}`} onClick={(e) => e.stopPropagation()}>
                   <span className="text-dark font-xsss">{recipientName}</span>
                 </Link>
              </div>
            </>
          )}
        </div>
      )}

      {/* --- Основная информация --- */}
      <div className="card-body p-0 d-flex flex-column">
        <div className="flex-grow-1">
          <span className="text-dark font-xs mb-1">{title}</span>
          {promise.hashtags && promise.hashtags.length > 0 && (
            <div className="mb-2">
              {promise.hashtags.map(tag => (
                <span key={tag} className="badge bg-secondary me-1">#{tag}</span>
              ))}
            </div>
          )}
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
          <span className="text-muted font-xssss">
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
        <div className="mt-0" onClick={(e) => e.stopPropagation()}>
          <span className="text-muted small font-xssss mt-0 mb-2 d-block">Создано: {formatDateTime(created_at)}</span>
          <p className="text-muted lh-sm small mb-2">{content}</p>
          {media_url && (
            <div className="mb-2">
              {mediaType?.startsWith('video') ? (
                <video src={media_url} controls className="w-100 rounded" style={{ backgroundColor: '#000' }} />
              ) : (
                <img src={media_url} alt="media" className="w-100 rounded" style={{ objectFit: 'cover' }} />
              )}
            </div>
          )}
          {/* --- Новый блок: логика для обещаний "кому-то" --- */}
          {isToSomeone ? (
            <>
              {/* --- Для создателя (Ю1) --- */}
              {isCreator && (
                <div className="d-flex flex-column align-items-center mb-2">
                  {/* Не подтверждено */}
                  {promise.is_accepted === null && !promise.is_completed_by_creator && (
                    <button className="btn btn-outline-secondary mb-2" disabled>
                      Не подтверждено
                    </button>
                  )}
                  {/* Отказано */}
                  {promise.is_accepted === false && (
                    <button className="btn btn-outline-danger w-50 mb-2" disabled>
                      Отказано
                    </button>
                  )}
                                     {/* Принято, но не завершено */}
                   {promise.is_accepted === true && !promise.is_completed_by_creator && (
                     <button
                       className="btn btn-outline-primary w-50 mb-2"
                       onClick={handleCompleteForRecipient}
                       disabled={actionLoading}
                     >
                       {actionLoading ? 'Обработка...' : 'Создать отчет'}
                     </button>
                   )}
                  {/* Завершено создателем, ждет подтверждения */}
                  {promise.is_accepted === true && promise.is_completed_by_creator && !promise.is_completed_by_recipient && (
                    <button className="btn btn-outline-warning w-50 mb-2" disabled>
                      Ожидание подтверждения
                    </button>
                  )}
                  {/* Обещание полностью выполнено */}
                  {promise.is_accepted === true && promise.is_completed_by_creator && promise.is_completed_by_recipient && (
                    <button 
                      className="btn btn-outline-primary w-50 mb-2"
                      onClick={() => setIsResultModalOpen(true)}
                    >
                      Результат
                    </button>
                  )}
                </div>
              )}
              {/* --- Для получателя (Ю2) --- */}
              {isRecipient && (
                <div className="d-flex flex-column align-items-center mb-2">
                  {/* Не обработано: принять/отклонить */}
                  {promise.is_accepted === null && !promise.is_completed_by_recipient && (
                    <div className="d-flex gap-2 mb-2">
                      <button className="btn btn-outline-primary" onClick={handleAccept} disabled={actionLoading}>
                        {actionLoading ? 'Обработка...' : 'Принять'}
                      </button>
                      <button className="btn btn-outline-danger" onClick={handleDecline} disabled={actionLoading}>
                        {actionLoading ? 'Обработка...' : 'Отказать'}
                      </button>
                    </div>
                  )}
                  {/* Принято, ждет завершения создателя */}
                  {promise.is_accepted === true && !promise.is_completed_by_creator && (
                    <button className="btn btn-outline-warning w-50 mb-2" disabled>
                      Ожидание завершения
                    </button>
                  )}
                  {/* Завершено создателем, ждет подтверждения получателя */}
                  {promise.is_accepted === true && promise.is_completed_by_creator && !promise.is_completed_by_recipient && (
                    <div className="d-flex gap-2 mb-2">
                      <button className="btn btn-outline-success" onClick={handleConfirmComplete} disabled={actionLoading}>
                        {actionLoading ? 'Обработка...' : 'Подтвердить выполнение'}
                      </button>
                      {/* Можно добавить кнопку "Отклонить выполнение" при необходимости */}
                    </div>
                  )}
                  {/* Обещание полностью выполнено */}
                  {promise.is_accepted === true && promise.is_completed_by_creator && promise.is_completed_by_recipient && (
                    <button 
                      className="btn btn-outline-primary w-50 mb-2"
                      onClick={() => setIsResultModalOpen(true)}
                    >
                      Результат
                    </button>
                  )}
                  {/* Отказано */}
                  {promise.is_accepted === false && (
                    <button className="btn btn-outline-danger w-50 mb-2" disabled>
                      Отказано
                    </button>
                  )}
                </div>
              )}
            </>
          ) : (
            // --- Старая логика для обычных обещаний ---
            <>
              {isOwnProfile && isProfilePage && !is_completed && (
                <div className="d-flex justify-content-center py-2 position-relative">
                  <button
                    className="btn btn-outline-primary w-50 mb-2"
                    onClick={handleComplete}
                  >
                    Завершить
                  </button>
                    {showTooltip && (!canCompletePromise(created_at) || !isDeadlineActive) && (
                      <div className="position-absolute w-100 bottom-100 start-50 translate-middle-x mb-1 p-2 bg-white text-dark rounded shadow-sm font-xsss tooltip-container text-center border" style={{ zIndex: 1000, minWidth: '200px' }}>
                        <div className="mb-1">
                          {!canCompletePromise(created_at) 
                            ? 'Завершить обещание можно не раньше, чем через 3 часа после создания'
                            : 'Завершить обещание можно только до дедлайна'
                          }
                        </div>
                        {!canCompletePromise(created_at) && (
                          <div className="text-secondary">
                              Осталось: {getTimeUntilCompletionAllowed(created_at)}
                          </div>
                        )}
                      </div>
                    )}
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
            </>
          )}
          {isCompleteModalOpen && (
            <PromiseCompleteModal
              onClose={() => setIsCompleteModalOpen(false)}
              onSubmit={handleCompleteSubmit}
              loading={completeLoading}
            />
          )}
          {isCompleteForRecipientModalOpen && (
            <PromiseCompleteForRecipientModal
              onClose={() => setIsCompleteForRecipientModalOpen(false)}
              onSubmit={handleCompleteForRecipientSubmit}
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

          {/* --- Кнопки лайка и поделиться внизу --- */}
          <div className="d-flex align-items-center justify-content-between pt-2 border-top">
            <div className="w-50 d-flex justify-content-center">
              <LikeButton 
                postId={promise.id} 
                postType="promise" 
                size={20}
              />
            </div>
            <div className="w-50 d-flex justify-content-center">
              <button
                className="btn btn-link p-0"
                onClick={(e) => {
                  e.stopPropagation();
                  share();
                }}
                style={{
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer'
                }}
                title="Поделиться"
              >
                <Send size={20} className="text-muted" />
              </button>
            </div>
          </div>

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
                                 {isList && userCtxId !== userId && (
                   <button 
                     className="dropdown-item" 
                     onClick={() => router.push(userCtxId === userId ? `/user/${userId}` : `/profile/${userId}`)}
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
                {isOwnProfile && isProfilePage && canDeleteItem(created_at) && (
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