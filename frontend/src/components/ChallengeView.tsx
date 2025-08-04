// frontend/src/components/ChallengeView.tsx
'use client'

// --- Импорты ---
import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Ellipsis, GlobeLock, CirclePlay, CircleStop, ChevronDown, ChevronUp, Send } from 'lucide-react';
import { ChallengeData } from '@/types';
import { supabase } from '@/lib/supabaseClient';
import { formatDateTime } from '@/utils/formatDate';
import { canDeleteItem } from '@/utils/postRules';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useUser } from '@/context/UserContext';
import { useChallengeApi } from '@/hooks/useChallengeApi';
import { useChallengeParticipants } from '@/hooks/useChallengeParticipants';
import ChallengeCheckModal from './ChallengeCheckModal';
import LikeButton from './LikeButton';

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
  onStart?: () => void;
  onCheckDay?: () => void;
  onFinish?: () => void;
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
  onStart,
  onCheckDay,
  onFinish,
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
  const [isCheckModalOpen, setIsCheckModalOpen] = useState(false);
  type ChallengeReport = { id?: string; report_date: string; comment?: string; media_url?: string };
  const [reports, setReports] = useState<ChallengeReport[]>([]);
  const [reportsLoading, setReportsLoading] = useState(false);
  const [expandedReportId, setExpandedReportId] = useState<string | null>(null);
  const [isJoiningChallenge, setIsJoiningChallenge] = useState(false);
  
  // Используем новый хук для участников
  const {
    participants,
    isLoading: participantsLoading,
    error: participantsError,
    fetchParticipants,
    checkParticipation,
    joinChallenge,
    leaveChallenge,
    toggleParticipation
  } = useChallengeParticipants(
    challenge.user_id, // telegram_id владельца челленджа
    undefined, // setOwnerUserData - пока не передаем, так как нет глобального стейта владельца
    undefined  // setOwnerError - пока не передаем
  );

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
        // Убираем дублирующий вызов onUpdate - обновление уже происходит через API
        // onUpdate(updated);
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

  // Загрузка отчетов при открытии деталей челленджа
  useEffect(() => {
    if (!isOpen || !userId) return;
    setReportsLoading(true);
    fetch(`/api/challenges/reports?challenge_id=${challenge.id}&user_id=${userId}`)
      .then(res => res.ok ? res.json() : [])
      .then(data => setReports(data))
      .catch(() => setReports([]))
      .finally(() => setReportsLoading(false));
  }, [isOpen, challenge.id, userId]);

  // Загрузка участников при открытии деталей челленджа
  useEffect(() => {
    if (!isOpen) return;
    fetchParticipants(challenge.id);
  }, [isOpen, challenge.id, fetchParticipants]);

  // Найти текущий период (сегодня)
  const today = new Date().toISOString().split('T')[0];
  const currentPeriod = useMemo(() => {
    if (!challenge.report_periods) return undefined;
    return challenge.report_periods.find(period => {
      const [start, end] = period.split('/');
      return today >= start && today <= end;
    });
  }, [challenge.report_periods, today]);

  // Проверить, есть ли отчет за этот период
  const hasReportToday = useMemo(() => {
    if (!currentPeriod || !reports.length) return false;
    const [start, end] = currentPeriod.split('/');
    return reports.some(r => {
      const reportDay = r.report_date.split('T')[0];
      return reportDay >= start && reportDay <= end;
    });  }, [currentPeriod, reports]);

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
    return challenge.report_periods.find((period) => {
      const [start] = period.split('/');
      return new Date(start) > now;
    });
  }, [isStarted, challenge.report_periods, now]);

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
      // console.log(updated)
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
      onDelete(challenge.id);
    }
  };

  const share = () => {
    if (navigator.share) {
      navigator.share({ 
        title: challenge.title, 
        text: challenge.content, 
        url: `${window.location.origin}/challenge/${challenge.id}` 
      }).catch(console.error);
    } else {
      alert('Поделиться недоступно');
    }
  };

  const handleStartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsCheckModalOpen(true);
  };

  const { handleFinishChallenge } = useChallengeApi(() => {}, () => {});

  const handleCheckSubmit = async (text: string, file: File | null, customAction?: 'start' | 'check_day' | 'finish') => {
    let mediaUrl = null;
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('telegramId', String(userId));
      const response = await fetch('/api/challenges/upload', { method: 'POST', body: formData });
      if (response.ok) {
        const data = await response.json();
        mediaUrl = data.url;
      }
    }
    // Определяем action
    let action: 'start' | 'check_day' | 'finish';
    if (customAction) {
      action = customAction;
    } else {
      action = isStarted ? 'check_day' : 'start';
    }
    if (action === 'finish') {
      if (!userId) return;
      const result = await handleFinishChallenge(challenge.id, userId, text, mediaUrl);
      console.log('[handleCheckSubmit] finish result:', result);
    } else if (action === 'start') {
      const response = await fetch(`/api/challenges?id=${challenge.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          action,
          comment: text,
          media_url: mediaUrl,
        }),
      });
      const result = await response.json();
      if (result && typeof onUpdate === 'function') {
        // result может быть { success, ...challengeFields }
        // onUpdate({ ...challenge, ...result });
        onUpdate(result);
      }
    } else {
      const response = await fetch(`/api/challenges?id=${challenge.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          action,
          comment: text,
          media_url: mediaUrl,
        }),
      });
      const result = await response.json();
    }
  };

  // --- Действия ---
  const [isSubscribed, setIsSubscribed] = useState(false);
  
  // Проверяем участие пользователя при загрузке
  useEffect(() => {
    if (!telegramId || !isOpen) return;
    
    const checkUserParticipation = async () => {
      const isParticipant = await checkParticipation(challenge.id, telegramId);
      setIsSubscribed(isParticipant);
    };
    
    checkUserParticipation();
  }, [telegramId, challenge.id, isOpen, checkParticipation]);

  const handleToggleChallengeSubscription = useCallback(async () => {
    if (isOwnProfile || !telegramId) return;
    setIsJoiningChallenge(true);
    try {
      const success = await toggleParticipation(challenge.id, telegramId);
      if (success) {
        setIsSubscribed(!isSubscribed);
      }
    } catch (error) {
      console.error('Error toggling challenge subscription:', error);
    } finally {
      setIsJoiningChallenge(false);
    }
  }, [challenge.id, isOwnProfile, telegramId, isSubscribed, toggleParticipation]);

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
          {challenge.hashtags && challenge.hashtags.length > 0 && (
            <div className="mb-2">
              {challenge.hashtags.map(tag => (
                <span key={tag} className="badge bg-secondary me-1">#{tag}</span>
              ))}
            </div>
          )}
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
          <span className="text-muted small font-xssss mb-2 d-block">Создано: {formatDateTime(challenge.created_at)}</span>
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
          {/* Кнопки для владельца челленджа */}
          {isOwnProfile && isProfilePage && !is_completed && (
            <div className="d-flex justify-content-center py-2">
              {!isStarted ? (
                <>
                  <button className="btn w-50 btn-outline-primary" onClick={() => setIsCheckModalOpen(true)} disabled={challenge.is_completed}>Начать</button>
                  <ChallengeCheckModal
                    isOpen={isCheckModalOpen}
                    onClose={() => setIsCheckModalOpen(false)}
                    onSubmit={async (text, file) => {
                      await handleCheckSubmit(text, file);
                      setIsCheckModalOpen(false);
                    }}
                  />
                </>
              ) : (
                <>
                  {!isLastPeriod && (
                    <>
                      <button
                        className={`btn w-50 ${!currentPeriod || hasReportToday || reportsLoading ? 'btn disabled' : 'btn-outline-primary'}`}
                        onClick={() => setIsCheckModalOpen(true)}
                        disabled={!currentPeriod || hasReportToday || reportsLoading}
                      >
                        Чек дня
                      </button>
                      <ChallengeCheckModal
                        isOpen={isCheckModalOpen}
                        onClose={() => setIsCheckModalOpen(false)}
                        onSubmit={async (text, file) => {
                          await handleCheckSubmit(text, file);
                          setIsCheckModalOpen(false);
                        }}
                        title="Челлендж продолжается!"
                        description="Вы на верном пути - сделайте отчет и вы будете еще на один шаг ближе к цели!"
                        buttonText="Чек дня"
                      />
                    </>
                  )}
                  {isLastPeriod && (
                    <>
                      <button className="btn w-50 btn-outline-primary" onClick={() => setIsCheckModalOpen(true)} disabled={challenge.is_completed}>
                        Завершить
                      </button>
                      <ChallengeCheckModal
                        isOpen={isCheckModalOpen}
                        onClose={() => setIsCheckModalOpen(false)}
                        onSubmit={async (text, file) => {
                          await handleCheckSubmit(text, file, 'finish');
                          setIsCheckModalOpen(false);
                        }}
                        title="Финиш!"
                        description="Поздравляем, вы дошли до конца челленджа. Оставьте финальный отчет!"
                        buttonText="Завершить"
                      />
                    </>
                  )}
                </>
              )}
            </div>
          )}

          {/* Кнопка присоединения/отписки для других пользователей */}
          {!isOwnProfile && !is_completed && (
            <div className="d-flex justify-content-center py-2">
              <button 
                className={`btn ${isSubscribed ? 'btn-outline-primary' : 'btn-outline-primary'}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleChallengeSubscription();
                }}
                disabled={isJoiningChallenge}
              >
                {isJoiningChallenge 
                  ? 'Обработка...' 
                  : isSubscribed 
                    ? 'Подписаны на челлендж' 
                    : 'Присоединиться'
                }
              </button>
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
              {activeTab === 'progress' ? (
                <div>
                  {reports.length === 0 && <div className="text-muted font-xsss">Нет отчетов</div>}
                  {[...reports].reverse().map((report, idx) => (
                    <div key={report.id || report.report_date + idx} className="mb-2">
                      <div
                        className="d-flex align-items-center justify-content-between cursor-pointer font-xsss px-2 py-1 bg-white"
                        style={{ minHeight: 36 }}
                        onClick={() => setExpandedReportId(expandedReportId === (report.id || report.report_date + idx) ? null : (report.id || report.report_date + idx))}
                      >
                        <span className="text-muted">
                          {report.report_date ? formatDateTime(report.report_date) : 'Без даты'}
                        </span>
                        {expandedReportId === (report.id || report.report_date + idx)
                          ? <ChevronUp className="ms-2 text-secondary" />
                          : <ChevronDown className="ms-2 text-secondary" />}
                      </div>
                      {expandedReportId === (report.id || report.report_date + idx) && (
                        <div className="p-2 border rounded bg-light font-xsss mt-1">
                          {report.comment && <div className="mb-2">{report.comment}</div>}
                          {report.media_url && (
                            report.media_url.endsWith('.mp4') ?
                              <video src={report.media_url} controls className="w-100 rounded" style={{ maxHeight: 200 }} /> :
                              <img src={report.media_url} alt="media" className="w-100 rounded" style={{ maxHeight: 200 }} />
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div>
                  {participantsLoading ? (
                    <div className="text-muted font-xsss">Загрузка участников...</div>
                  ) : participants.length === 0 ? (
                    <div className="text-muted font-xsss">Нет участников</div>
                  ) : (
                    <div>
                      {participants.map((participant) => (
                        <div key={participant.telegram_id} className="d-flex align-items-center mb-2 p-2">
                          <Link 
                            href={participant.telegram_id === telegramId ? `/user/${participant.telegram_id}` : `/profile/${participant.telegram_id}`}
                            onClick={(e) => e.stopPropagation()}
                            className="d-flex align-items-center text-decoration-none"
                          >
                            <img 
                              src={participant.avatar_img_url || '/assets/images/defaultAvatar.png'} 
                              alt="avatar" 
                              width={32} 
                              height={32} 
                              className="rounded-circle me-2" 
                              style={{ objectFit: 'cover' }} 
                            />
                            <span className="text-dark font-xsss">
                              {participant.first_name && participant.last_name 
                                ? `${participant.first_name} ${participant.last_name}`
                                : participant.username || `@${participant.telegram_id}`
                              }
                            </span>
                          </Link>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* --- Кнопки лайка и поделиться внизу --- */}
          <div className="d-flex align-items-center justify-content-between mt-3 pt-2 border-top">
            <div className="w-50 d-flex justify-content-center">
              <LikeButton 
                postId={challenge.id} 
                postType="challenge" 
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
                {isOwnProfile && isProfilePage && canDeleteItem(challenge.created_at) && (
                  <button className="dropdown-item text-danger" onClick={handleDelete}>
                    Удалить челлендж
                  </button>
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
