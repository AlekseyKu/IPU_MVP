'use client'
//frontend\src\components\ProfilecardThree.tsx

import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

// Определение пропсов компонента
interface Props {
  onToggleDetail?: () => void; // Функция переключения деталей профиля
  isOpen?: boolean; // Состояние открытости деталей
  username?: string; // Юзернейм пользователя
  fullName: string; // Полное имя (имя + фамилия)
  telegramId?: number; // ID пользователя в Telegram
  subscribers?: number; // Количество подписчиков
  promises?: number; // Количество обещаний
  promisesDone?: number; // Количество выполненных обещаний
  stars?: number; // Количество звёзд
  heroImgUrl?: string; // URL изображения фона
  avatarUrl?: string; // URL аватара
  onChangeHeroImg?: (url: string) => void; // Обработчик изменения фона
  onChangeAvatar?: (url: string) => void; // Обработчик изменения аватара
  onChangeFullName?: (firstName: string, lastName: string) => void; // Обработчик изменения имени
  isEditable?: boolean; // Режим редактирования (true для /settings)
  isSavingImage?: boolean; // Состояние сохранения изображения
  isSavingText?: boolean; // Состояние сохранения текста
  isDirty?: boolean; // Флаг изменений, требующих сохранения
  onSaveClick?: () => void; // Функция сохранения изменений
  onHeroClick?: (event: React.MouseEvent) => void; // Обработчик клика по фону
  onAvatarClick?: (event: React.MouseEvent) => void; // Обработчик клика по аватару
  isOwnProfile?: boolean; // Флаг, что профиль принадлежит текущему пользователю
  onSubscribe?: (telegramId: number, isSubscribed: boolean) => Promise<void>; // Обработчик подписки
  isSubscribed?: boolean; // Состояние подписки
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
  onChangeFullName,
  isEditable = false,
  isSavingImage = false,
  isSavingText = false,
  isDirty = false,
  onSaveClick,
  onHeroClick,
  onAvatarClick,
  isOwnProfile = false,
  onSubscribe,
  isSubscribed = false,
}) => {
  // Локальное состояние для процесса подписки
  const [isSubscribing, setIsSubscribing] = useState(false);
  // Общее состояние загрузки (сохранение изображения, текста или подписки)
  const isLoading = isSavingImage || isSavingText || isSubscribing;

  // Обработчик сохранения изменений (работает только в режиме редактирования)
  const handleSave = () => {
    if (!isEditable || !telegramId) return;
    const [first = '', last = ''] = fullName.split(' ');
    onChangeFullName?.(first, last);
    onSaveClick?.();
  };

  // Обработчик подписки/отписки (работает только для чужих профилей)
  const handleSubscribe = async () => {
    if (!telegramId || !onSubscribe) return;
    setIsSubscribing(true);
    try {
      await onSubscribe(telegramId, isSubscribed);
    } catch (error) {
      console.error('Error subscribing:', error);
    } finally {
      setIsSubscribing(false);
    }
  };

  // Массив данных для вкладок счётчиков
  const tabs = [
    { id: 'navtabs1', label: 'Подписчики', count: subscribers },
    { id: 'navtabs2', label: 'Обещания', count: promises },
    { id: 'navtabs3', label: 'Выполнено', count: promisesDone },
    { id: 'navtabs4', label: 'Звезды', count: stars },
  ];

  // Блок с именем и юзернеймом
  const nameBlock = (
    <div className="mt-0">
      <h4 className="fw-500 font-sm mt-0 mb-0" style={{ paddingLeft: '140px' }}>
        {fullName || 'Не указано'}
        <span className="fw-500 font-xssss text-grey-500 mt-1 mb-3 d-block">@{username || 'Не указано'}</span>
      </h4>
    </div>
  );

  // Блок с кнопкой переключения деталей (отображается только в режиме просмотра)
  const detailToggleBlock = (
    <button
      onClick={onToggleDetail}
      className="bg-greylight rounded-circle p-2 d-flex align-items-center justify-content-center border-0 ms-2"
      title="Toggle Profile Detail"
    >
      {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
    </button>
  );

  // Блок с кнопкой подписки (отображается только для чужих профилей)
  const subscribeBlock = (
    <div className="d-flex justify-content-end pe-3 pt-2 mb-2">
      <button
        onClick={handleSubscribe}
        className="btn btn-outline-primary me-2"
        disabled={isLoading}
      >
        {isSubscribing ? 'Обработка...' : isSubscribed ? 'Вы подписаны' : 'Подписаться'}
      </button>
    </div>
  );

  return (
    <div className="card w-100 border-0 p-0 bg-white shadow-xss rounded-xxl">
      {/* Секция фона профиля (редактируемая при isEditable=true) */}
      <div
        className="hero-img card-body p-0 rounded-xxxl overflow-hidden m-3"
        style={{
          height: '150px',
          position: 'relative',
          cursor: isEditable ? 'pointer' : 'default',
        }}
        onClick={isEditable ? onHeroClick : undefined}
      >
        <img
          src={heroImgUrl}
          alt="hero"
          className="d-block w-100 h-100"
          style={{
            objectFit: 'cover',
            objectPosition: 'center',
          }}
        />
      </div>

      <div className="card-body p-0 position-relative">
        {/* Аватар (редактируемый при isEditable=true) */}
        <figure
          className="avatar position-absolute z-index-1"
          style={{
            top: '-40px',
            left: '30px',
            cursor: isEditable ? 'pointer' : 'default',
            width: '100px',
            height: '100px',
          }}
          onClick={isEditable ? onAvatarClick : undefined}
        >
          <img
            src={avatarUrl}
            alt="avatar"
            className="p-1 bg-white rounded-circle w-100 h-100"
            style={{
              objectFit: 'cover',
              objectPosition: 'center',
            }}
          />
        </figure>

        {/* Кнопка Сохранить (отображается только при isEditable=true) */}
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

        {/* Имя и юзернейм с кнопкой переключения деталей (отображается только в режиме просмотра) */}
        {!isEditable && (
          <div className="d-flex align-items-center justify-content-between pe-3">
            {nameBlock}
            {onToggleDetail && detailToggleBlock}
          </div>
        )}
      </div>

      {/* Нижняя секция: счётчики и дополнительные элементы */}
      <div className="card-body d-block w-100 shadow-none mb-0 mt-2 pt-2 p-0 border-top-xs">
        {/* Счётчики (отображаются только при !isEditable) */}
        {!isEditable && (
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
        )}

        {/* Кнопка подписки (отображается только для чужих профилей) */}
        {!isOwnProfile && subscribeBlock}
      </div>
    </div>
  );
};

export default ProfilecardThree;