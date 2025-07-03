// frontend/src/components/ProfilecardThree.tsx
'use client'

import React from 'react';

interface ProfilecardThreeProps {
  onToggleDetail: () => void;
  isOpen: boolean;
  nickname: string;
  telegramId: number;
  subscribers: number;
  promises: number;
  promisesDone: number;
  stars: number;
  fullName: string; // Новый проп
}

const ProfilecardThree: React.FC<ProfilecardThreeProps> = ({ onToggleDetail, isOpen, nickname, telegramId, subscribers, promises, promisesDone, stars, fullName }) => {
  return (
    <div className="card w-100 shadow-xss rounded-xxl border-0 p-4">
      <div className="card-body p-0 d-flex">
        <figure className="avatar me-3">
          <img src="https://via.placeholder.com/50" alt="avatar" className="shadow-sm rounded-circle w-50" />
        </figure>
        <div className="card-body p-0">
          <h4 className="fw-700 mb-0 text-grey-900 font-xsss">{fullName || 'Guest'}</h4> {/* Используем fullName */}
          <span className="text-grey-500 font-xssss">@{nickname || telegramId.toString()}</span> {/* Используем nickname как идентификатор */}
          <a href="#" className="mt-2 d-inline-block text-grey-900 fw-700 text-decoration-none" onClick={(e) => { e.preventDefault(); onToggleDetail(); }}>
            {isOpen ? 'Скрыть детали' : 'Показать детали'}
          </a>
          <div className="mt-3 d-flex align-items-center">
            <div className="mr-3">
              <h4 className="text-grey-900 font-xsss fw-700">{subscribers}</h4>
              <span className="d-block font-xssss fw-500 text-grey-500">Подписчики</span>
            </div>
            <div className="mr-3">
              <h4 className="text-grey-900 font-xsss fw-700">{promises}</h4>
              <span className="d-block font-xssss fw-500 text-grey-500">Обещания</span>
            </div>
            <div className="mr-3">
              <h4 className="text-grey-900 font-xsss fw-700">{promisesDone}</h4>
              <span className="d-block font-xssss fw-500 text-grey-500">Выполнено</span>
            </div>
            <div>
              <h4 className="text-grey-900 font-xsss fw-700">{stars}</h4>
              <span className="d-block font-xssss fw-500 text-grey-500">Звезды</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilecardThree;