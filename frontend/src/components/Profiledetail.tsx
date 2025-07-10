// frontend/src/components/Profiledetail.tsx
'use client'

import React, { useState, useEffect, useRef } from 'react';

interface Props {
  username?: string;
  telegramId?: number;
  fullName: string;
  about?: string;
  address?: string;
  onChangeAbout?: (text: string) => void;
  onChangeAddress?: (text: string) => void;
  onChangeFullName?: (firstName: string, lastName: string) => void;
  isEditable?: boolean;
  isSavingImage?: boolean;
  isOwnProfile?: boolean;
  scrollContainerRef?: React.RefObject<HTMLElement>;
}

const Profiledetail: React.FC<Props> = ({
  username = '',
  telegramId = 0,
  fullName = '',
  about = '',
  address = '',
  onChangeAbout,
  onChangeAddress,
  onChangeFullName,
  isEditable = false,
  isSavingImage = false,
  isOwnProfile = false,
  scrollContainerRef,
}) => {
  const [localAbout, setLocalAbout] = useState(about);
  const [localAddress, setLocalAddress] = useState(address);
  const [firstName, setFirstName] = useState(fullName.split(' ')[0] || '');
  const [lastName, setLastName] = useState(fullName.split(' ')[1] || '');
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const firstNameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);
  const aboutRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setLocalAbout(about);
    setLocalAddress(address);
    setFirstName(fullName.split(' ')[0] || '');
    setLastName(fullName.split(' ')[1] || '');
  }, [about, address, fullName]);

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
      const offsetTop = inputRect.top - containerRect.top + scrollContainerRef.current.scrollTop - 150;

      scrollContainerRef.current.scrollTo({
        top: offsetTop,
        behavior: 'smooth',
      });
    }, 300);
  };

  return (
    <div className="card w-100 shadow-xss rounded-xxl border-0 mb-3">
      <div className="card-body d-block px-3">
        <h4 className="fw-700 mb-3 font-xsss text-grey-900 ms-1">Информация</h4>

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
                  placeholder="Имя"
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
                  placeholder="Фамилия"
                />
              </div>
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
              placeholder="О себе"
              style={{ height: '180px' }}
            />
          </div>
        ) : (
          <p className="fw-500 text-grey-500 lh-24 font-xssss mb-2">{localAbout || 'Не указано'}</p>
        )}
      </div>

      <div className="card-body px-4 pt-0 text-center position-relative">
        <h4
          className="fw-700 text-grey-900 font-xsss m-0"
          onClick={() => setShowTooltip(true)}
          style={{ cursor: 'pointer' }}
        >
          TG Username: {username || 'Не указано'}
        </h4>

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
            Telegram username остается неизменным для оптимального поиска и привязки пользователей к аккаунту.
          </div>
        )}
      </div>
    </div>
  );
};

export default Profiledetail;