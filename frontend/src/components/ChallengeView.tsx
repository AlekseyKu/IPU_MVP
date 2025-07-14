// frontend/src/components/ChallengeView.tsx
'use client'

import React, { useState, useEffect, useRef } from 'react';
import { Ellipsis, Globe, GlobeLock } from 'lucide-react';
import { ChallengeData } from '@/types';
import { supabase } from '@/lib/supabaseClient';
import { formatDateTime } from '@/utils/formatDate';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface ChallengeViewProps {
  challenge: ChallengeData;
  onToggle: () => void;
  isOpen: boolean;
  onUpdate: (updatedChallenge: ChallengeData) => void; // Изменен тип на ChallengeData
  onDelete: (id: string) => void;
  isOwnProfile: boolean;
  isList?: boolean;
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
  avatarUrl,
  userId,
  userName
}) => {
  const { id, title, deadline, content, media_url, created_at, is_public, frequency, total_reports, completed_reports } = challenge;
  const [menuOpen, setMenuOpen] = useState(false);
  const [localChallenge, setLocalChallenge] = useState<ChallengeData>(challenge);
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
            <div className="text-muted font-xssss mb-1">
              Частота: {frequency}, Прогресс: {completed_reports}/{total_reports}
            </div>
          )}
        </div>
        {/* <div className="d-flex justify-content-between align-items-center">
          <span className="text-muted font-xsss">
            Дэдлайн: {formatDateTime(deadline)}
          </span>
        </div> */}
      </div>

      {isOpen && (
        <div className="mt-3">
          <p className="text-muted lh-sm small mb-2">{content}</p>
          {media_url && (
            <div className="mb-3" onClick={(e) => e.stopPropagation()}>
              {mediaType?.startsWith('video') ? (
                <video src={media_url} controls className="w-100 rounded" style={{ backgroundColor: '#000' }} />
              ) : (
                <img src={media_url} alt="media" className="w-100 rounded" style={{ objectFit: 'cover' }} />
              )}
            </div>
          )}

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
                {isOwnProfile && (
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