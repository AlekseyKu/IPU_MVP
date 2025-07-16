// frontend\src\components\ChallengeView.tsx
'use client'

import React, { useState, useEffect, useRef } from 'react';
import { Ellipsis, Globe, GlobeLock } from 'lucide-react';
import { ChallengeData } from '@/types';
import { supabase } from '@/lib/supabaseClient';
import { formatDateTime } from '@/utils/formatDate';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useUser } from '@/context/UserContext';

const frequencyMap: Record<string, string> = {
  daily: 'Ежедневный',
  weekly: 'Еженедельный',
  monthly: 'Ежемесячный',
};

interface ChallengeViewProps {
  challenge: ChallengeData;
  onToggle: () => void;
  isOpen: boolean;
  onUpdate: (updatedChallenge: ChallengeData) => void;
  onDelete: (id: string) => void;
  isOwnProfile: boolean;
  isList?: boolean;
  isProfilePage?: boolean;
  avatarUrl?: string;
  userId?: number;
  userName?: string;
}

const ChallengeView: React.FC<ChallengeViewProps> = ({
  challenge,
  onToggle,
  isOpen,
  onUpdate,
  onDelete,
  isOwnProfile,
  isList = false,
  isProfilePage = false,
  avatarUrl,
  userId,
  userName
}) => {
  const { telegramId: currentUserId } = useUser();
  const { id, title, content, media_url, created_at, is_public, frequency, total_reports, completed_reports, is_completed, start_at, report_periods, deadline_period } = challenge;
  const [menuOpen, setMenuOpen] = useState(false);
  const [localChallenge, setLocalChallenge] = useState<ChallengeData>(challenge);
  const [activeTab, setActiveTab] = useState<'progress' | 'participants'>('progress');
  const router = useRouter();

  useEffect(() => {
    const subscription = supabase
      .channel(`challenge-update-${id}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'challenges',
        filter: `id=eq.${id}`,
      }, (payload) => {
        const updated = payload.new as ChallengeData;
        setLocalChallenge(updated);
        onUpdate(updated);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [id, onUpdate]);

  const handleDelete = async () => {
    if (!id || !isOwnProfile) return;
    if (confirm('Вы уверены, что хотите удалить этот челлендж?')) {
      const { error } = await supabase.from('challenges').delete().eq('id', id);
      if (!error) {
        onDelete(id);
        setMenuOpen(false);
      } else {
        console.error('Error deleting challenge:', error);
      }
    }
  };

  const copyLink = () => {
    const link = `${window.location.origin}/challenge/${id}`;
    navigator.clipboard.writeText(link).then(() => alert('Ссылка скопирована!'));
    setMenuOpen(false);
  };

  const share = () => {
    const shareData = {
      title: localChallenge.title,
      text: localChallenge.content,
      url: `${window.location.origin}/challenge/${id}`,
    };
    if (navigator.share) {
      navigator.share(shareData).catch((error) => console.error('Error sharing:', error));
    } else {
      alert('Поделиться недоступно на этом устройстве');
    }
    setMenuOpen(false);
  };

  const PublicIcon = localChallenge.is_public ? Globe : GlobeLock;

  const [mediaType, setMediaType] = useState<string | null>(null);

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

  const now = new Date('2025-07-17T00:06:00+07:00'); // Текущая дата и время
  const isStarted = !!start_at && new Date(start_at) <= now;
  const frequencyInterval = { daily: 1, weekly: 7, monthly: 30 }[frequency || 'daily'];

  const generateReportPeriods = (start: Date, totalReports: number, interval: number): string[] => {
    const periods = [];
    let currentStart = new Date(start);
    for (let i = 0; i < totalReports; i++) {
      const periodEnd = new Date(currentStart);
      periodEnd.setDate(currentStart.getDate() + interval - 1);
      periods.push(`${currentStart.toISOString().split('T')[0]}/${periodEnd.toISOString().split('T')[0]}`);
      currentStart.setDate(currentStart.getDate() + interval);
    }
    return periods;
  };

  const handleStart = async () => {
    if (!isOwnProfile || !currentUserId || isStarted) return;

    const startDate = now;
    const newReportPeriods = generateReportPeriods(startDate, total_reports, frequencyInterval);
    const newDeadlinePeriod = newReportPeriods[newReportPeriods.length - 1];

    const { error: reportError } = await supabase.from('challenge_reports').insert({
      user_id: Number(currentUserId),
      challenge_id: id,
      report_date: startDate.toISOString(),
    });

    if (reportError) {
      console.error('Error inserting report:', reportError);
      return;
    }

    const { error } = await supabase
      .from('challenges')
      .update({
        start_at: startDate.toISOString(),
        report_periods: newReportPeriods,
        deadline_period: newDeadlinePeriod,
        completed_reports: 1,
      })
      .eq('id', id);

    if (!error) {
      const updated = { ...localChallenge, start_at: startDate.toISOString(), report_periods: newReportPeriods, deadline_period: newDeadlinePeriod, completed_reports: 1 };
      setLocalChallenge(updated);
      onUpdate(updated);
    }
  };

  const isCheckDayActive = isStarted && report_periods?.some((period: string, index: number) => {
    const [start, end] = period.split('/');
    const startDate = new Date(start);
    const endDate = new Date(end);
    const nowDateOnly = new Date(now.toISOString().split('T')[0]);
    return nowDateOnly >= startDate && nowDateOnly <= endDate && index >= completed_reports;
  });

  const isLastPeriod = isStarted && deadline_period && (() => {
    const [start, end] = deadline_period.split('/');
    if (!start || !end) return false;
    const startDate = new Date(start);
    const endDate = new Date(end);
    const nowDateOnly = new Date(now.toISOString().split('T')[0]);
    const endDateOnly = new Date(endDate.toISOString().split('T')[0]);
    const currentPeriodIndex = report_periods ? report_periods.findIndex(p => p === deadline_period) : -1;
    return currentPeriodIndex === (report_periods?.length ?? 0) - 1 && nowDateOnly >= startDate && nowDateOnly <= endDateOnly;
  })();

  const nextPeriod = isStarted && report_periods?.find((period: string, index: number) => {
    const [start] = period.split('/');
    const startDate = new Date(start);
    return startDate > now && index === completed_reports;
  });

  const formattedNextPeriod = nextPeriod
    ? (() => {
        const [start, end] = nextPeriod.split('/');
        const startDate = new Date(start).toLocaleDateString('ru-RU');
        const endDate = new Date(end).toLocaleDateString('ru-RU');
        return startDate === endDate ? startDate : `${startDate} - ${endDate}`;
      })()
    : null;

  const handleCheckDay = async () => {
    if (!isOwnProfile || !currentUserId || !isCheckDayActive) return;

    const response = await fetch(`/api/challenges?id=${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: currentUserId, action: 'check_day' }),
    });

    if (response.ok) {
      const updated = { ...localChallenge, completed_reports: localChallenge.completed_reports + 1 };
      setLocalChallenge(updated);
      onUpdate(updated);
    }
  };

  const handleFinish = async () => {
    if (!isOwnProfile || !isLastPeriod) return;

    const response = await fetch(`/api/challenges?id=${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: currentUserId, action: 'finish', final_check: true }),
    });

    if (response.ok) {
      const updated = { ...localChallenge, completed_reports: localChallenge.completed_reports + 1, is_completed: true };
      setLocalChallenge(updated);
      onUpdate(updated);
    }
  };

  return (
    <div className="card w-100 shadow-sm rounded-xxl border-0 p-3 mb-3 position-relative" onClick={onToggle}>
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
      <div className="card-body p-0 d-flex flex-column">
        <div className="flex-grow-1">
          <span className="text-dark font-xs mb-1">{title}</span>
          {isOwnProfile && !isList && (
            <div className="d-flex justify-content-end align-items-center mb-1">
              <span className="text-muted font-xssss me-1">{localChallenge.is_public ? 'Публичное' : 'Личное'}</span>
              <PublicIcon className="w-2 h-2 text-muted" />
            </div>
          )}
          {frequency && total_reports && (
            <div className="text-muted font-xsss mb-1">
              {frequencyMap[frequency]} челлендж, Прогресс: {completed_reports}/{total_reports}
            </div>
          )}
        </div>
      </div>

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

          <div className="d-flex justify-content-center mb-2">
            {!isStarted ? (
              <button
                className="btn w-50 btn-outline-primary me-2"
                onClick={handleStart}
                disabled={is_completed}
              >
                Начать
              </button>
            ) : (
              <>
                {!isLastPeriod && (
                  <button
                    className={`btn w-50 mt-3 ${
                      !isCheckDayActive || completed_reports >= total_reports
                      ? 'btn disabled' 
                      : 'btn-outline-primary'
                    }`}
                    onClick={handleCheckDay}
                    disabled={!isCheckDayActive || completed_reports >= total_reports}
                  >
                    Чек дня
                  </button>
                )}
                {isLastPeriod && (
                  <button
                    className="btn w-50 btn-outline-primary"
                    onClick={handleFinish}
                    disabled={is_completed}
                  >
                    Завершить
                  </button>
                )}
              </>
            )}
          </div>

          {isStarted && nextPeriod && (
            <div className="d-flex justify-content-center text-muted font-xsss mb-2">
              Следующий Чек дня: {formattedNextPeriod}
            </div>
          )}

          <div className="mb-2">
            <div className="d-flex justify-content-around border-bottom">
              <button
                className={`btn btn-sm p-2 ${activeTab === 'progress' ? 'text-primary' : 'text-muted'}`}
                onClick={() => setActiveTab('progress')}
              >
                Трекер прогресса
              </button>
              <button
                className={`btn btn-sm p-2 ${activeTab === 'participants' ? 'text-primary' : 'text-muted'}`}
                onClick={() => setActiveTab('participants')}
              >
                Участники
              </button>
            </div>
            <div className="p-2">
              {activeTab === 'progress' && (
                <div className="text-muted font-xsss">Трекер прогресса (пусто)</div>
              )}
              {activeTab === 'participants' && (
                <div className="text-muted font-xsss">Участники (пусто)</div>
              )}
            </div>
          </div>

          <span className="text-muted small">Создано: {formatDateTime(created_at)}</span>

          <div className="position-absolute bottom-0 end-0 mb-3 me-3">
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
                <button className="dropdown-item" onClick={copyLink}>Скопировать ссылку</button>
                <button className="dropdown-item" onClick={share}>Отправить</button>
                {isOwnProfile && isProfilePage && (
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
};

export default ChallengeView;