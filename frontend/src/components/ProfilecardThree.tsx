// frontend/src/components/ProfilecardThree.tsx
'use client'

import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface Props {
  onToggleDetail?: () => void;
  isOpen?: boolean;
  username?: string;
  fullName: string;
  telegramId?: number;
  subscribers?: number;
  promises?: number;
  promisesDone?: number;
  stars?: number;
  heroImgUrl?: string;
  avatarUrl?: string;
  onChangeHeroImg?: (url: string) => void;
  onChangeAvatar?: (url: string) => void;
  onChangeFullName?: (firstName: string, lastName: string) => void;
  isEditable?: boolean;
  onHeroClick?: (event: React.MouseEvent) => void;
  onAvatarClick?: (event: React.MouseEvent) => void;
}

const ProfilecardThree: React.FC<Props> = ({
  onToggleDetail,
  isOpen = false,
  username = '',
  fullName = '',
  telegramId = 0,
  subscribers = 0,
  promises = 0,
  promisesDone = 0,
  stars = 0,
  heroImgUrl = '/assets/images/ipu/hero-img.png',
  avatarUrl = '/assets/images/ipu/avatar.png',
  onChangeHeroImg,
  onChangeAvatar,
  isEditable = false,
  onHeroClick,
  onAvatarClick,
}) => {
  const [heroImg, setHeroImg] = useState(heroImgUrl);
  const [avatar, setAvatar] = useState(avatarUrl);

  const tabs = [
    { id: 'navtabs1', label: 'Подписчики', count: subscribers },
    { id: 'navtabs2', label: 'Обещания', count: promises },
    { id: 'navtabs3', label: 'Выполнено', count: promisesDone },
    { id: 'navtabs4', label: 'Звезды', count: stars },
  ];

  return (
    <div className="card w-100 border-0 p-0 bg-white shadow-xss rounded-xxl">
      <div
        className="hero-img card-body p-0 rounded-xxl overflow-hidden m-3"
        style={{ 
          height: '150px', 
          position: 'relative', 
          cursor: isEditable ? 'pointer' : 'default' }}
        onClick={isEditable ? onHeroClick : undefined}
      >
        <img 
          src={heroImg} 
          alt="hero" 
          className="d-block w-100 h-100"
          style={{ 
            objectFit: 'cover', 
            objectPosition: 'center',
          }} 
        />
      </div>

      <div className="card-body p-0 position-relative">
        <figure
          className="avatar position-absolute w100 z-index-1"
          style={{ top: '-40px', left: '30px', cursor: isEditable ? 'pointer' : 'default' }}
          onClick={isEditable ? onAvatarClick : undefined}
        >
          <img
            src={avatar}
            alt="avatar"
            className="float-right p-1 bg-white rounded-circle w-100"
          />
        </figure>

        <div className="ster d-flex align-items-center justify-content-between pb-1">
          {isEditable ? (
            <div style={{ paddingLeft: '140px', paddingBottom: '7vh' }} />
          ) : (
            <h4 className="fw-500 font-sm mt-0 mb-lg-5 mb-0" style={{ paddingLeft: '140px' }}>
              {fullName || 'Не указано'}
              <span className="fw-500 font-xssss text-grey-500 mt-1 mb-3 d-block">@{username || 'Не указано'}</span>
            </h4>
          )}

          {!isEditable && onToggleDetail && (
            <button
              onClick={onToggleDetail}
              className="bg-greylight rounded-circle p-2 me-4 d-flex align-items-center justify-content-center border-0"
              title="Toggle Profile Detail"
            >
              {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          )}
        </div>
      </div>

      {!isEditable && (
        <div className="card-body d-block w-100 shadow-none mb-0 mt-2 pt-2 p-0 border-top-xs">
          <ul
            className="nav nav-tabs h55 d-flex product-info-tab ps-0 border-bottom-0 w-100"
            id="pills-tab"
            role="tablist"
          >
            {tabs.map(({ label, count }, i) => (
              <li
                key={i}
                className="flex-fill d-flex flex-column align-items-center justify-content-center text-center me-0"
              >
                <div className="fw-400 font-xss mb-0">{count}</div>
                <div className="fw-400 font-xssss text-dark">{label}</div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default ProfilecardThree;