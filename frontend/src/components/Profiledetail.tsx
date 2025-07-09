// frontend/src/components/Profiledetail.tsx
import React, { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

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
}) => {
  const [localAbout, setLocalAbout] = useState(about);
  const [localAddress, setLocalAddress] = useState(address);
  const [firstName, setFirstName] = useState(fullName.split(' ')[0] || '');
  const [lastName, setLastName] = useState(fullName.split(' ')[1] || '');
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLocalAbout(about);
    setLocalAddress(address);
    setFirstName(fullName.split(' ')[0] || '');
    setLastName(fullName.split(' ')[1] || '');
  }, [about, address, fullName]);

  const handleSave = async () => {
    if (isEditable && telegramId) {
      try {
        const { error } = await supabase
          .from('users')
          .update({
            first_name: firstName,
            last_name: lastName,
            about: localAbout,
            address: localAddress,
          })
          .eq('telegram_id', telegramId);

        if (error) {
          console.error('Error saving user data:', error.message);
        } else {
          console.log('User data saved:', { firstName, lastName, about: localAbout, address: localAddress });
          onChangeFullName?.(firstName, lastName);
          onChangeAbout?.(localAbout);
          onChangeAddress?.(localAddress);
        }
      } catch (error) {
        console.error('General error saving user data:', error);
      }
    }
  };

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

  return (
    <div className="card w-100 shadow-xss rounded-xxl border-0 mb-3">
      <div className="card-body d-block px-3">
        <h4 className="fw-700 mb-3 font-xsss text-grey-900 ms-1">Информация</h4>

        {isEditable ? (
          <div className="mb-3">
            <div className="d-flex flex-wrap gap-2 mb-2">
              <div className="flex-fill">
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="form-control font-xsss"
                  placeholder="Имя"
                />
              </div>
              <div className="flex-fill">
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="form-control font-xsss"
                  placeholder="Фамилия"
                />
              </div>
            </div>

            <textarea
              value={localAbout}
              onChange={(e) => setLocalAbout(e.target.value)}
              className="form-control lh-24 font-xsss mb-0"
              placeholder="О себе"
              style={{ height: '180px' }}
            />

            <button
              onClick={handleSave}
              className="btn btn-primary mt-3"
            >
              Сохранить
            </button>
          </div>
        ) : (
          <>
            <p className="fw-500 text-grey-500 lh-24 font-xssss mb-2">{localAbout || 'Не указано'}</p>
          </>
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