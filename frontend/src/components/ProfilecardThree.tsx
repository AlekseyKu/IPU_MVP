// frontend\src\components\ProfilecardThree.tsx
'use client'

import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import KarmaHistory from './KarmaHistory';

interface Props {
  onToggleDetail?: () => void;
  isOpen?: boolean;
  username?: string;
  telegramId?: number;
  subscribers?: number;
  promises?: number;
  promisesDone?: number;
  karma_points?: number;
  heroImgUrl?: string;
  avatarUrl?: string;
  isEditable?: boolean;
  isSavingImage?: boolean;
  isSavingText?: boolean;
  isDirty?: boolean;
  onSaveClick?: () => void | Promise<void>;
  onHeroClick?: (event: React.MouseEvent) => void;
  onAvatarClick?: (event: React.MouseEvent) => void;
  onChangeFullName?: (firstName: string, lastName: string) => void;
  isOwnProfile?: boolean;
  onSubscribe?: (telegramId: number, isSubscribed: boolean) => Promise<void>;
  isSubscribed?: boolean;
  firstName: string;
  lastName: string;
}

const ProfilecardThree: React.FC<Props> = ({
  onToggleDetail,
  isOpen = false,
  username = '',
  telegramId = 0,
  subscribers = 0,
  promises = 0,
  promisesDone = 0,
  karma_points = 0,
  heroImgUrl = '/assets/images/ipu/hero-img.png',
  avatarUrl = '/assets/images/ipu/avatar.png',
  isEditable = false,
  isSavingImage = false,
  isSavingText = false,
  isDirty = false,
  onSaveClick,
  onHeroClick,
  onAvatarClick,
  onChangeFullName,
  isOwnProfile = false,
  onSubscribe,
  isSubscribed = false,
  firstName,
  lastName,
}) => {
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [showKarmaHistory, setShowKarmaHistory] = useState(false);
  const isLoading = isSavingImage || isSavingText || isSubscribing;

  const handleSave = () => {
    if (!isEditable || !telegramId) return;
    onChangeFullName?.(firstName, lastName);
    onSaveClick?.();
  };

  const handleSubscribe = async () => {
    if (!telegramId || !onSubscribe || isOwnProfile) return;
    setIsSubscribing(true);
    try {
      await onSubscribe(telegramId, isSubscribed);
    } catch (error) {
      console.error('Error subscribing:', error);
    } finally {
      setIsSubscribing(false);
    }
  };



  const tabs = [
    { label: 'Подписчики', count: subscribers, onClick: undefined },
    { label: 'Обещания', count: promises, onClick: undefined },
    { label: 'Выполнено', count: promisesDone, onClick: undefined },
    { label: 'Карма', count: karma_points, onClick: () => setShowKarmaHistory(true) },
  ];

  // Безопасное формирование полного имени
  const fullName = [firstName, lastName].filter(Boolean).join(' ').trim();

  return (
    <div className="card w-100 border-0 p-0 bg-white shadow-xss rounded-xxl">
      <div
        className="hero-img card-body p-0 rounded-xxxl overflow-hidden m-3"
        style={{ height: '150px', position: 'relative', cursor: isEditable ? 'pointer' : 'default' }}
        onClick={isEditable ? onHeroClick : undefined}
      >
        <img
          src={heroImgUrl}
          alt="hero"
          className="d-block w-100 h-100"
          style={{ objectFit: 'cover', objectPosition: 'center' }}
        />
      </div>

      <div className="card-body p-0 position-relative">
        <figure
          className="avatar position-absolute z-index-1"
          style={{ top: '-40px', left: '30px', cursor: isEditable ? 'pointer' : 'default', width: '100px', height: '100px' }}
          onClick={isEditable ? onAvatarClick : undefined}
        >
          <img
            src={avatarUrl}
            alt="avatar"
            className="p-1 bg-white rounded-circle w-100 h-100"
            style={{ objectFit: 'cover', objectPosition: 'center' }}
          />
        </figure>

        {isEditable && (
          <div className="d-flex justify-content-end pe-3 pt-2 mb-2">
            <button
              onClick={handleSave}
              className={`btn btn-primary ${!isDirty ? 'opacity-50' : ''}`}
              disabled={!isDirty || isSavingText || isSavingImage}
            >
              {(isSavingText || isSavingImage) ? 'Сохранение...' : 'Сохранить'}
            </button>
          </div>
        )}

        {!isEditable && (
          <div className="d-flex align-items-center justify-content-between pe-3">
            <div className="mt-0" style={{ paddingLeft: '140px' }}>
              <h4 className="fw-500 font-sm mt-0 mb-0">
                {fullName || 'Не указано'}
                <span className="fw-500 font-xssss text-grey-500 mt-1 mb-3 d-block">@{username || 'Не указано'}</span>
              </h4>
            </div>
            {onToggleDetail && (
              <button
                onClick={onToggleDetail}
                className="bg-greylight rounded-circle p-2 d-flex align-items-center justify-content-center border-0 ms-2"
                title="Toggle Profile Detail"
              >
                {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            )}
          </div>
        )}
      </div>

      <div className="card-body d-block w-100 shadow-none mb-0 mt-2 pt-2 p-0 border-top-xs">
        {!isEditable && (
          <>
            <ul
              className="nav nav-tabs h55 d-flex product-info-tab ps-0 border-bottom-0 w-100"
              role="tablist"
            >
              {tabs.map(({ label, count, onClick }, i) => (
                <li
                  key={i}
                  className="flex-fill d-flex flex-column align-items-center justify-content-center text-center me-0"
                  onClick={onClick}
                  style={{ cursor: onClick ? 'pointer' : 'default' }}
                >
                  <div className="fw-400 font-xss mb-0">{count}</div>
                  <div className="fw-400 font-xssss text-dark">{label}</div>
                </li>
              ))}
            </ul>
            {!isOwnProfile && (
              <div className="d-flex justify-content-end pe-3 pt-2 mb-2">
                <button
                  onClick={handleSubscribe}
                  className="btn btn-outline-primary"
                  disabled={isLoading}
                >
                  {isSubscribing ? 'Обработка...' : isSubscribed ? 'Вы подписаны' : 'Подписаться'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
      
      {/* Модальное окно истории кармы */}
      <KarmaHistory
        userId={telegramId}
        isVisible={showKarmaHistory}
        onClose={() => setShowKarmaHistory(false)}
      />
    </div>
  );
};

export default ProfilecardThree;
