'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '@/context/LanguageContext';

interface Props {
  username?: string;
  telegramId?: number;
  firstName?: string;
  lastName?: string;
  about?: string;
  email?: string;
  onChangeAbout?: (text: string) => void;
  onChangeEmail?: (text: string) => void;
  onChangeFullName?: (firstName: string, lastName: string) => void;
  isEditable?: boolean;
  isSavingImage?: boolean;
  isOwnProfile?: boolean;
  scrollContainerRef?: React.RefObject<HTMLElement>;
}

const Profiledetail: React.FC<Props> = ({
  username = '',
  telegramId = 0,
  firstName: propFirstName = '',
  lastName: propLastName = '',
  about = '',
  email = '',
  onChangeAbout,
  onChangeEmail,
  onChangeFullName,
  isEditable = false,
  isSavingImage = false,
  isOwnProfile = false,
  scrollContainerRef,
}) => {
  const { t } = useLanguage();
  const [localAbout, setLocalAbout] = useState(about);
  const [localEmail, setLocalEmail] = useState(email);

  const [firstName, setFirstName] = useState(propFirstName);
  const [lastName, setLastName] = useState(propLastName);

  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const firstNameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);
  const aboutRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setLocalAbout(about);
    setLocalEmail(email);
    setFirstName(propFirstName);
    setLastName(propLastName);
  }, [about, email, propFirstName, propLastName]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
        setShowTooltip(false);
      }
    }

    if (showTooltip) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showTooltip]);

  const scrollToInput = (ref: React.RefObject<HTMLElement>) => {
    setTimeout(() => {
      if (!ref.current || !scrollContainerRef?.current) return;

      const inputRect = ref.current.getBoundingClientRect();
      const containerRect = scrollContainerRef.current.getBoundingClientRect();
      const offsetTop =
        inputRect.top - containerRect.top + scrollContainerRef.current.scrollTop - 150;

      scrollContainerRef.current.scrollTo({
        top: offsetTop,
        behavior: 'smooth',
      });
    }, 300);
  };

  return (
    <div className="card w-100 shadow-xss rounded-xxl border-0 mb-3">
      <div className="card-body d-block px-3">
        <h4 className="fw-700 mb-3 font-xsss text-grey-900 ms-1">{t('profileDetail.information')}</h4> {/* "Информация" */}

        {isEditable ? (
          <div className="mb-3">
            <div className="d-flex flex-wrap gap-2 mb-2">
              <div className="flex-fill">
                <input
                  ref={firstNameRef}
                  type="text"
                  value={firstName}
                  onFocus={() => scrollToInput(firstNameRef)}
                  onChange={(e) => {
                    const value = e.target.value;
                    setFirstName(value);
                    onChangeFullName?.(value, lastName);
                  }}
                  className="form-control font-xsss"
                  placeholder={t('profileDetail.firstName')} // {/* "Имя" */}
                />
              </div>
              <div className="flex-fill">
                <input
                  ref={lastNameRef}
                  type="text"
                  value={lastName}
                  onFocus={() => scrollToInput(lastNameRef)}
                  onChange={(e) => {
                    const value = e.target.value;
                    setLastName(value);
                    onChangeFullName?.(firstName, value);
                  }}
                  className="form-control font-xsss"
                  placeholder={t('profileDetail.lastName')} // {/* "Фамилия" */}
                />
              </div>
            </div>

            <div className="mb-2">
              <input
                type="email"
                value={localEmail}
                onChange={(e) => {
                  const value = e.target.value;
                  setLocalEmail(value);
                  onChangeEmail?.(value);
                }}
                className="form-control font-xsss"
                placeholder={t('profileDetail.email')} //{/* "Email" */}
              />
            </div>

            <textarea
              ref={aboutRef}
              onFocus={() => scrollToInput(aboutRef)}
              value={localAbout}
              onChange={(e) => {
                const value = e.target.value;
                setLocalAbout(value);
                onChangeAbout?.(value);
              }}
              className="form-control lh-24 font-xsss mb-0"
              placeholder={t('profileDetail.about')} // {/* "О себе" */}
              style={{ height: '180px' }}
            />
          </div>
        ) : (
          <div>
            {/* "Отображение имени и фамилии в режиме просмотра" */}
            {[firstName, lastName].filter(Boolean).length > 0 && (
              <p className="fw-500 text-grey-500 lh-24 font-xssss mb-2">
                {t('profileDetail.name')}: {[firstName, lastName].filter(Boolean).join(' ') || t('profileDetail.notSpecified')} {/* "Имя:" и "Не указано" */}
              </p>
            )}
            <p className="fw-500 text-grey-500 lh-24 font-xssss mb-2">
              {localAbout || t('profileDetail.notSpecified')} {/* "Не указано" */}
            </p>
            {localEmail && (
              <p className="fw-500 text-grey-500 lh-24 font-xssss mb-2">
                {t('profileDetail.email')}: {localEmail} {/* "Email:" */}
              </p>
            )}
          </div>
        )}
      </div>

      <div className="card-body px-4 pt-0 text-center position-relative">
        <span
          className="font-xssss text-grey-900 font-xsss m-0"
          onClick={() => setShowTooltip(true)}
          style={{ cursor: 'pointer' }}
        >
          {t('profileDetail.telegramUsername')}: {username || t('profileDetail.notSpecified')} {/* "TG Username:" и "Не указано" */}
        </span>

        {showTooltip && (
          <div
            ref={tooltipRef}
            className="position-absolute bg-white border p-2 shadow rounded font-xssss"
            style={{
              bottom: '100%',
              right: '5%',
              width: '90%',
              zIndex: 1000,
              marginBottom: '8px',
            }}
          >
            {t('profileDetail.telegramUsernameTooltip')} {/* "Telegram username остается неизменным для оптимального поиска и привязки пользователей к аккаунту." */}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profiledetail;
