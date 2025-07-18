// frontend\src\components\PromiseView.tsx
'use client'

import React, { useState, useEffect } from 'react';
import { CirclePlay, CircleStop, Ellipsis, Globe, GlobeLock } from 'lucide-react';
import { PromiseData } from '@/types';
import { formatDateTime } from '@/utils/formatDate';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface PostviewProps {
  promise: PromiseData;
  onToggle: () => void;
  isOpen: boolean;
  onUpdate: (updatedPromise: PromiseData) => void;
  onDelete: (id: string) => void;
  isOwnProfile: boolean;
  isList?: boolean;
  isProfilePage?: boolean; // Новый проп
  avatarUrl?: string;
  userId?: number;
  userName?: string;
}

const PromiseView: React.FC<PostviewProps> = ({
  promise,
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
  const { id, title, deadline, content, media_url, is_completed, created_at, is_public } = promise;
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  // Определяем mediaType по расширению файла
  // let mediaType: string | null = null;
  // if (media_url) {
  //   const ext = media_url.split('.').pop()?.toLowerCase();
  //   if (ext && ['mp4', 'webm', 'ogg'].includes(ext)) mediaType = 'video';
  //   else if (ext && ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) mediaType = 'image';
  // }

  const handleComplete = () => {
    if (!id || !isOwnProfile) return;
    onUpdate({ ...promise, is_completed: true });
    setMenuOpen(false);
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

  const statusText = is_completed ? 'Завершено' : 'Активно';
  const Icon = is_completed ? CircleStop : CirclePlay;
  const iconColor = is_completed ? 'text-grey' : 'text-primary';
  const PublicIcon = is_public ? Globe : GlobeLock;

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
          {isOwnProfile && isProfilePage && ( // Показываем только на странице профиля
            <div className="d-flex justify-content-end align-items-center mb-1">
              <span className="text-muted font-xssss me-1">{is_public ? 'Публичное' : 'Личное'}</span>
              <PublicIcon className="w-2 h-2 text-muted" />
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
                {isOwnProfile && isProfilePage && !is_completed && (
                  <button className="dropdown-item text-accent" onClick={handleComplete}>
                    Завершить обещание
                  </button>
                )}
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