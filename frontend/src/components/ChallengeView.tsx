// frontend\src\components\ChallengeView.tsx
'use client'

// --- Импорты ---
import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Ellipsis, GlobeLock, CirclePlay, CircleStop } from 'lucide-react';
import { ChallengeData } from '@/types';
import { supabase } from '@/lib/supabaseClient';
import { formatDateTime } from '@/utils/formatDate';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useUser } from '@/context/UserContext';
import { useChallengeApi } from '@/hooks/useChallengeApi';

// --- Константы ---
const frequencyMap: Record<string, string> = {
  daily: 'Ежедневный',
  weekly: 'Еженедельный',
  monthly: 'Ежемесячный',
};

// --- Типы ---
interface ChallengeViewProps {
  challenge: ChallengeData;
  onToggle: () => void;
  onUpdate: (updatedChallenge: ChallengeData) => void;
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
const ChallengeView: React.FC<ChallengeViewProps> = React.memo(({
  challenge,
  onToggle,
  onUpdate,
  onDelete,
  isOpen,
  isOwnProfile,
  isList = false,
  isProfilePage = false,
  avatarUrl,
  userId,
  userName,
}) => {
  // --- Хуки и состояния ---
  const { telegramId } = useUser();
  const router = useRouter();
  const renderCount = useRef(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<'progress' | 'participants'>('progress');
  const [mediaType, setMediaType] = useState<string | null>(null);
  const [showVideo, setShowVideo] = useState(false);
  const { handleDeleteChallenge } = useChallengeApi();

  // --- Эффекты ---
  useEffect(() => {
    renderCount.current += 1;
    // console.log(`Render #${renderCount.current} with challenge id: ${challenge.id}, completed_reports: ${challenge.completed_reports}`);
  }, [challenge.id, challenge.completed_reports]);

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

  // Realtime подписка на обновления челленджа
  useEffect(() => {
    const subscription = supabase
      .channel(`challenge-update-${challenge.id}`)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'challenges', filter: `id=eq.${challenge.id}` }, (payload) => {
        const updated = payload.new as ChallengeData;
        if (updated.id === challenge.id) {
          onUpdate(updated);
        }
      })
      .subscribe();
    return () => { supabase.removeChannel(subscription); };
  }, [challenge.id, onUpdate]);

  // Определение типа медиа
  useEffect(() => {
    if (!challenge.media_url) return;
    fetch(challenge.media_url, { method: 'HEAD' })
      .then((res) => { const type = res.headers.get('Content-Type'); if (type) setMediaType(type); })
      .catch((err) => { console.error('Error determining media type:', err); });
  }, [challenge.media_url]);

  // Сброс предпросмотра видео при смене медиа
  useEffect(() => { setShowVideo(false); }, [challenge.media_url]);

  // --- Вычисления статусов и иконок ---
  const now = useMemo(() => new Date(), []);
  const isStarted = challenge.start_at && new Date(challenge.start_at) <= now;
  const is_completed = challenge.is_completed;
  const statusText = is_completed ? 'Завершено' : 'Челлендж';
  const Icon = is_completed ? CircleStop : CirclePlay;
  const iconColor = is_completed ? 'text-grey' : 'text-secondary';

  // --- Прогресс и периоды ---
  const isCheckDayActive = useMemo(() => {
    return isStarted && challenge.report_periods?.some((period, index) => {
      const [start, end] = period.split('/');
      return now >= new Date(start) && now <= new Date(end) && index >= challenge.completed_reports;
    });
  }, [challenge.report_periods, challenge.completed_reports, isStarted, now]);

  const isLastPeriod = useMemo(() => {
    if (!isStarted || !challenge.deadline_period || !challenge.report_periods) return false;
    const [start, end] = challenge.deadline_period.split('/');
    const startDate = new Date(start);
    const endDate = new Date(end);
    const nowDateOnly = new Date(now.toISOString().split('T')[0]);
    return challenge.report_periods.findIndex(p => p === challenge.deadline_period) === (challenge.report_periods.length - 1) && nowDateOnly >= startDate && nowDateOnly <= endDate;
  }, [challenge.deadline_period, challenge.report_periods, isStarted, now]);

  const nextPeriod = useMemo(() => {
    if (!isStarted || !challenge.report_periods) return undefined;
    return challenge.report_periods.find((period, index) => {
      const [start] = period.split('/');
      return new Date(start) > now && index > challenge.completed_reports;
    });
  }, [isStarted, challenge.report_periods, challenge.completed_reports, now]);

  const formattedNextPeriod = useMemo(() => {
    if (!nextPeriod) return undefined;
    const [start, end] = nextPeriod.split('/');
    const startDate = new Date(start).toLocaleDateString('ru-RU');
    const endDate = new Date(end).toLocaleDateString('ru-RU');
    return startDate === endDate ? startDate : `${startDate} - ${endDate}`;
  }, [nextPeriod]);

  // --- Действия ---
  const handleStart = useCallback(async () => {
    if (!isOwnProfile || !userId || isStarted) return;
    const response = await fetch(`/api/challenges?id=${challenge.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, action: 'start', start_at: now.toISOString() }),
    });
    if (response.ok) {
      const updated = await response.json();
      onUpdate({ ...challenge, ...updated, start_at: now.toISOString() });
    }
  }, [challenge, isOwnProfile, userId, isStarted, now, onUpdate]);

  const handleCheckDay = useCallback(async () => {
    if (!isOwnProfile || !userId || !isCheckDayActive) return;
    const response = await fetch(`/api/challenges?id=${challenge.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, action: 'check_day' }),
    });
    if (response.ok) {
      const updated = await response.json();
      onUpdate({ ...challenge, ...updated });
    }
  }, [challenge, isOwnProfile, userId, isCheckDayActive, onUpdate]);

  const handleFinish = useCallback(async () => {
    if (!isOwnProfile || !userId || !isLastPeriod) return;
    const response = await fetch(`/api/challenges?id=${challenge.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, action: 'finish', final_check: true }),
    });
    if (response.ok) {
      const updated = await response.json();
      onUpdate({ ...challenge, ...updated });
    }
  }, [challenge, isOwnProfile, userId, isLastPeriod, onUpdate]);

  const handleDelete = async () => {
    if (!isOwnProfile || !isProfilePage) return;
    if (confirm('Вы уверены, что хотите удалить этот челлендж?')) {
      const result = await handleDeleteChallenge(challenge.id);
      if (result.success) {
        onDelete(challenge.id);
      } else {
        alert(result.error);
      }
    }
  };

  // --- JSX ---
  return (
    <div className="card w-100 shadow-sm rounded-xxl border-0 p-3 mb-3 position-relative" onClick={onToggle}>
      {/* --- Заголовок и аватар --- */}
      {isList && userId && (
        <div className="d-flex align-items-center mb-2">
          <Link href={isOwnProfile ? `/user/${userId}` : `/profile/${userId}`} onClick={e => e.stopPropagation()}>
            <img src={avatarUrl || '/assets/images/defaultAvatar.png'} alt="avatar" width={32} height={32} className="rounded-circle me-2" style={{ objectFit: 'cover' }} />
          </Link>
          <span className="text-dark font-xsss">{userName || 'Guest'}</span>
        </div>
      )}

      {/* --- Основная информация --- */}
      <div className="card-body p-0 d-flex flex-column">
        <div className="flex-grow-1">
          <span className="text-dark font-xs mb-1">{challenge.title}</span>
          {isOwnProfile && !isList && (
            <div className="d-flex justify-content-end align-items-center mb-1">
              <span className="text-muted font-xssss me-1">{challenge.is_public ? 'Публичное' : 'Личное'}</span>
              <GlobeLock className="w-2 h-2 text-muted" />
            </div>
          )}
          {challenge.frequency && challenge.total_reports && (
            <div className="d-flex justify-content-between align-items-center">
              <div className="text-muted font-xsss mb-1">
                {frequencyMap[challenge.frequency]} <br />
                Прогресс: {challenge.completed_reports}/{challenge.total_reports}
              </div>
              <div className="d-flex align-items-center align-self-end text-nowrap ms-2">
                <span className="text-muted font-xssss me-1">{statusText}</span>
                <Icon className={`w-2 h-2 ${iconColor}`} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* --- Детали челленджа --- */}
      {isOpen && (
        <div className="mt-3" onClick={e => e.stopPropagation()}>
          <p className="text-muted lh-sm small mb-2">{challenge.content}</p>
          {challenge.media_url && (
            <div className="mb-2">
              {mediaType?.startsWith('video') ? (
                <video src={challenge.media_url} controls className="w-100 rounded" style={{ backgroundColor: '#000' }} />
              ) : (
                <img src={challenge.media_url} alt="media" className="w-100 rounded" />
              )}
            </div>
          )}

          {/* --- Кнопки управления --- */}
          {isOwnProfile && isProfilePage && (
            <div className="d-flex justify-content-center mb-2">
              {!isStarted ? (
                <button className="btn w-50 btn-outline-primary" onClick={handleStart} disabled={challenge.is_completed}>Начать</button>
              ) : (
                <>
                  {!isLastPeriod && (
                    <button
                      className={`btn w-50 ${!isCheckDayActive || challenge.completed_reports >= challenge.total_reports ? 'btn disabled' : 'btn-outline-primary'}`}
                      onClick={handleCheckDay}
                      disabled={!isCheckDayActive || challenge.completed_reports >= challenge.total_reports}
                    >
                      Чек дня
                    </button>
                  )}
                  {isLastPeriod && (
                    <button className="btn w-50 btn-outline-primary" onClick={handleFinish} disabled={challenge.is_completed}>
                      Завершить
                    </button>
                  )}
                </>
              )}
            </div>
          )}

          {/* --- Следующий чек --- */}
          {isStarted && formattedNextPeriod && (
            <div className="d-flex justify-content-center text-muted font-xsss mb-2">
              Следующий Чек дня: {formattedNextPeriod}
            </div>
          )}

          {/* --- Вкладки --- */}
          <div className="mb-2">
            <div className="d-flex justify-content-around border-bottom">
              <button className={`btn btn-sm p-2 ${activeTab === 'progress' ? 'text-primary' : 'text-muted'}`} onClick={() => setActiveTab('progress')}>Трекер прогресса</button>
              <button className={`btn btn-sm p-2 ${activeTab === 'participants' ? 'text-primary' : 'text-muted'}`} onClick={() => setActiveTab('participants')}>Участники</button>
            </div>
            <div className="p-2">
              {activeTab === 'progress'
                ? <div className="text-muted font-xsss">Трекер прогресса (пусто)</div>
                : <div className="text-muted font-xsss">Участники (пусто)</div>
              }
            </div>
          </div>

          {/* --- Дата создания и меню --- */}
          <span className="text-muted small">Создано: {formatDateTime(challenge.created_at)}</span>
          <div ref={menuRef} className="position-absolute top-0 end-0 mt-3 me-3">
            <Ellipsis className="cursor-pointer text-muted" size={24} onClick={e => { e.stopPropagation(); setMenuOpen(!menuOpen); }} />
            {menuOpen && (
              <div className="dropdown-menu show p-2 bg-white font-xsss border rounded shadow-sm position-absolute end-0 mt-1">
                {isList && !isOwnProfile && (
                  <button className="dropdown-item" onClick={() => router.push(isOwnProfile ? `/user/${userId}` : `/profile/${userId}`)}>
                    Посмотреть профиль
                  </button>
                )}
                <button className="dropdown-item" onClick={() => {navigator.clipboard.writeText(`${window.location.origin}/challenge/${challenge.id}`).then(() => alert('Ссылка скопирована!')); setMenuOpen(false);}}>Скопировать ссылку</button>
                <button className="dropdown-item" onClick={() => {if (navigator.share) {navigator.share({ title: challenge.title, text: challenge.content, url: `${window.location.origin}/challenge/${challenge.id}` }).catch(console.error);} else alert('Поделиться недоступно'); setMenuOpen(false);}}>Отправить</button>
                {isOwnProfile && isProfilePage && (
                  <button className="dropdown-item text-danger" onClick={handleDelete}>Удалить челлендж</button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
});

export default ChallengeView;
