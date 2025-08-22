// frontend\src\components\PromiseView.tsx
'use client'

// --- Импорты ---
import React, { useState, useRef, useEffect } from 'react';
import { CirclePlay, CircleStop, Ellipsis, Globe, GlobeLock, MoveRight, Send } from 'lucide-react';
import { PromiseData } from '@/types';
import { formatDateTime } from '@/utils/formatDate';
import { canDeleteItem, canCompletePromise, getTimeUntilCompletionAllowed, isPromiseExpired } from '@/utils/postRules';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import PromiseCompleteModal from './PromiseCompleteModal';
import PromiseCompleteForRecipientModal from './PromiseCompleteForRecipientModal';
import { usePromiseApi } from '@/hooks/usePromiseApi';
import PromiseResultModal from './PromiseResultModal';
import LikeButton from './LikeButton';
import { useLanguage } from '@/context/LanguageContext';

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
  const { t } = useLanguage();
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
  const statusText = is_completed ? t('status.completed') : t('status.active'); // "Завершено" или "Активно"
  const Icon = is_completed ? CircleStop : CirclePlay;
  const iconColor = is_completed ? 'text-grey' : 'text-primary';
  // const PublicIcon = is_public ? Globe : GlobeLock;

  // --- Проверка дедлайна ---
  const isDeadlineActive = (() => {
    if (!deadline) return false;
    const now = new Date();
    const deadlineDate = new Date(deadline);
    // Кнопка активна, если текущее время не позже дедлайна (включительно)
    // И прошло минимум 3 часа с момента создания
    return now <= deadlineDate && canCompletePromise(created_at);
  })();

  // --- Проверка просроченного обещания ---
  const isExpired = isPromiseExpired(deadline);

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
      alert(t('promiseView.errors.completionError')); // "Ошибка при завершении обещания"
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
        if (!response.ok) throw new Error(t('promiseView.errors.uploadError')); // "Ошибка загрузки файла"
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
      alert(t('promiseView.errors.reportError')); // "Ошибка при отправке отчета"
      console.error(error);
    } finally {
      setCompleteLoading(false);
    }
  };

  const handleDelete = () => {
    if (!id || !isOwnProfile) return;
    if (confirm(t('promiseView.confirm.delete'))) { // "Вы уверены, что хотите удалить это обещание?"
      onDelete(id);
      setMenuOpen(false);
    }
  };

  const copyLink = () => {
    // const botUsername = 'ipu_promise_bot';
    const botUsername = 'I_P_U_bot';
    const link = `https://t.me/${botUsername}?startapp=promise_${id}`;
    navigator.clipboard.writeText(link).then(() => alert(t('promiseView.success.linkCopied'))); // "Ссылка скопирована!"
    setMenuOpen(false);
  };

  const share = () => {
    const botUsername = 'ipu_promise_bot';
    const shareUrl = `https://t.me/${botUsername}?startapp=promise_${id}`;
    const shareData = {
      title: promise.title,
      text: promise.content,
      url: shareUrl,
    };
    if (navigator.share) {
      navigator.share(shareData).catch((error) => console.error('Error sharing:', error));
    } else {
      alert(t('promiseView.errors.shareUnavailable')); // "Поделиться недоступно на этом устройстве"
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

  // --- Новая функция для закрытия просроченного обещания ---
  const handleCloseExpiredPromise = async () => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/promises?id=${promise.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          user_id: promise.user_id, 
          action: 'close_expired',
          result_content: 'Не выполнено',
          completed_at: new Date().toISOString()
        })
      });
      if (res.ok) {
        const updatedPromise = await res.json();
        onUpdate(updatedPromise);
      }
    } catch (error) {
      console.error('Ошибка при закрытии просроченного обещания:', error);
      alert('Ошибка при закрытии обещания');
    } finally {
      setActionLoading(false);
    }
  };

  // --- Новая функция для закрытия просроченного обещания "кому-то" (для создателя) ---
  const handleCloseExpiredPromiseForCreator = async () => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/promises?id=${promise.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          user_id: promise.user_id, 
          action: 'close_expired_for_creator',
          result_content: 'Не выполнено',
          completed_at: new Date().toISOString()
        })
      });
      if (res.ok) {
        const updatedPromise = await res.json();
        onUpdate(updatedPromise);
      }
    } catch (error) {
      console.error('Ошибка при закрытии просроченного обещания:', error);
      alert('Ошибка при закрытии обещания');
    } finally {
      setActionLoading(false);
    }
  };

  // --- Новая функция для закрытия просроченного обещания "кому-то" (для получателя) ---
  const handleCloseExpiredPromiseForRecipient = async () => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/promises?id=${promise.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          user_id: userCtxId, 
          action: 'close_expired_for_recipient',
          result_content: 'Не выполнено',
          completed_at: new Date().toISOString()
        })
      });
      if (res.ok) {
        const updatedPromise = await res.json();
        onUpdate(updatedPromise);
      }
    } catch (error) {
      console.error('Ошибка при закрытии просроченного обещания:', error);
      alert('Ошибка при закрытии обещания');
    } finally {
      setActionLoading(false);
    }
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
          <span className="text-dark font-xsss">{userName || t('promiseView.guest')}</span> {/* "Guest" */}
          
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
                   <span className="text-muted font-xssss me-1">{t('promiseView.private')}</span> {/* "Личное" */}
                   <GlobeLock className="w-2 h-2 text-muted" />
                 </>
               )}
             </div>
           )}
        </div>
        <div className="d-flex justify-content-between align-items-center">
          <span className="text-muted font-xssss">
            {t('status.deadline')}: {formatDateTime(deadline)} {/* "Дэдлайн:" */}
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
          <span className="text-muted small font-xssss mt-0 mb-2 d-block">{t('status.created')}: {formatDateTime(created_at)}</span> {/* "Создано:" */}
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
                  {/* Просроченное обещание */}
                  {isExpired && !promise.is_completed && (
                    <button
                      className="btn btn-outline-secondary w-50 mb-2"
                      onClick={handleCloseExpiredPromiseForCreator}
                      disabled={actionLoading}
                    >
                      {actionLoading ? t('common.loading') : t('status.deadlinePassed')} {/* "Закрываем..." или "Истек дедлайн" */}
                    </button>
                  )}
                  {/* Не просроченное обещание */}
                  {!isExpired && (
                    <>
                      {/* Не подтверждено */}
                      {promise.is_accepted === null && !promise.is_completed_by_creator && (
                        <button className="btn btn-outline-secondary mb-2" disabled>
                          {t('status.notConfirmed')} // "Не подтверждено"
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
                          {actionLoading ? t('common.loading') : t('promiseView.createReport')} {/* "Обработка..." или "Создать отчет" */}
                        </button>
                      )}
                      {/* Завершено создателем, ждет подтверждения */}
                      {promise.is_accepted === true && promise.is_completed_by_creator && !promise.is_completed_by_recipient && (
                        <button className="btn btn-outline-warning w-50 mb-2" disabled>
                          {t('status.waitingCompletion')} {/* "Ожидание подтверждения" */}
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
                    </>
                  )}
                </div>
              )}
              {/* --- Для получателя (Ю2) --- */}
              {isRecipient && (
                <div className="d-flex flex-column align-items-center mb-2">
                  {/* Просроченное обещание */}
                  {isExpired && !promise.is_completed && (
                    <button
                      className="btn btn-outline-secondary w-50 mb-2"
                      onClick={handleCloseExpiredPromiseForRecipient}
                      disabled={actionLoading}
                    >
                      {actionLoading ? 'Закрываем...' : 'Истек дедлайн'}
                    </button>
                  )}
                  {/* Не просроченное обещание */}
                  {!isExpired && (
                    <>
                      {/* Не обработано: принять/отклонить */}
                      {promise.is_accepted === null && !promise.is_completed_by_recipient && (
                        <div className="d-flex gap-2 mb-2">
                          <button className="btn btn-outline-primary" onClick={handleAccept} disabled={actionLoading}>
                            {actionLoading ? t('common.loading') : t('promiseActions.accept')} {/* "Обработка..." или "Принять" */}
                          </button>
                          <button className="btn btn-outline-danger" onClick={handleDecline} disabled={actionLoading}>
                            {actionLoading ? t('common.loading') : t('promiseActions.reject')} {/* "Обработка..." или "Отказать" */}
                          </button>
                        </div>
                      )}
                      {/* Принято, ждет завершения создателя */}
                      {promise.is_accepted === true && !promise.is_completed_by_creator && (
                        <button className="btn btn-outline-warning w-50 mb-2" disabled>
                          {t('status.waitingCompletion')} {/* "Ожидание завершения" */}
                        </button>
                      )}
                      {/* Завершено создателем, ждет подтверждения получателя */}
                      {promise.is_accepted === true && promise.is_completed_by_creator && !promise.is_completed_by_recipient && (
                        <div className="d-flex gap-2 mb-2">
                          <button className="btn btn-outline-success" onClick={handleConfirmComplete} disabled={actionLoading}>
                            {actionLoading ? t('common.loading') : t('promiseView.confirmCompletion')} {/* "Обработка..." или "Подтвердить выполнение" */}
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
                    </>
                  )}
                </div>
              )}
            </>
          ) : (
            // --- Старая логика для обычных обещаний ---
            <>
              {isOwnProfile && isProfilePage && !is_completed && (
                <div className="d-flex justify-content-center py-2 position-relative">
                  {isExpired ? (
                    // Кнопка для просроченного обещания
                    <button
                      className="btn btn-outline-primary w-50 mb-2"
                      onClick={handleCloseExpiredPromise}
                      disabled={actionLoading}
                    >
                      {actionLoading ? t('common.loading') : t('status.deadlinePassed')} {/* "Закрываем..." или "Истек дедлайн" */}
                    </button>
                  ) : (
                    // Обычная кнопка завершения
                    <button
                      className="btn btn-outline-primary w-50 mb-2"
                      onClick={handleComplete}
                    >
                      {t('promiseComplete.buttons.complete')} {/* "Завершить" */}
                    </button>
                  )}
                  {showTooltip && (!canCompletePromise(created_at) || !isDeadlineActive) && !isExpired && (
                    <div className="position-absolute w-100 bottom-100 start-50 translate-middle-x mb-1 p-2 bg-white text-dark rounded shadow-sm font-xsss tooltip-container text-center border" style={{ zIndex: 1000, minWidth: '200px' }}>
                      <div className="mb-1">
                        {!canCompletePromise(created_at) 
                          ? t('promiseView.tooltip.earlyCompletion') // "Завершить обещание можно не раньше, чем через 3 часа после создания"
                          : t('promiseView.tooltip.deadlineOnly') // "Завершить обещание можно только до дедлайна"
                        }
                      </div>
                      {!canCompletePromise(created_at) && (
                        <div className="text-secondary">
                          {t('promiseView.menu.deletePromise')} {/* "Удалить обещание" */}
                          {t('promiseView.tooltip.timeRemaining')}: {getTimeUntilCompletionAllowed(created_at)} {/* "Осталось:" */}
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
                    {t('status.result')} {/* "Результат" */}
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
                     {t('promiseView.menu.viewProfile')} {/* "Посмотреть профиль" */}
                  </button>
                )}
                {/* {isOwnProfile && isProfilePage && !is_completed && (
                  <button className="dropdown-item text-accent" onClick={handleComplete}>
                    Завершить обещание
                  </button>
                )} */}
                <button className="dropdown-item" onClick={copyLink}>{t('common.copy')}</button> {/* "Скопировать ссылку" */}
                <button className="dropdown-item" onClick={share}>{t('common.share')}</button> {/* "Отправить" */}
                {isOwnProfile && isProfilePage && canDeleteItem(created_at) && (
                  <button className="dropdown-item text-danger" onClick={handleDelete}>
                    {t('promiseView.menu.deletePromise')} {/* "Удалить обещание" */}
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