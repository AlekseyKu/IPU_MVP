// frontend\src\components\UserSearch.tsx
import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { UserData } from '@/types';

interface UserSearchProps {
  onSelect?: (user: UserData) => void;
  placeholder?: string;
  myTelegramId?: number;
}

const MIN_QUERY_LENGTH = 3;
const DEBOUNCE_DELAY = 300;

const UserSearch: React.FC<UserSearchProps> = ({ onSelect, placeholder = 'Поиск пользователей...', myTelegramId }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (query.length < MIN_QUERY_LENGTH) {
      setResults([]);
      setIsDropdownOpen(false);
      setError(null);
      return;
    }
    setLoading(true);
    setError(null);
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Ошибка поиска');
        setResults(data.users || []);
        setIsDropdownOpen(true);
        setError(null);
      } catch (e: any) {
        setError(e.message || 'Ошибка поиска');
        setResults([]);
        setIsDropdownOpen(true);
      } finally {
        setLoading(false);
      }
    }, DEBOUNCE_DELAY);
    return () => {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    };
  }, [query]);

  // Закрытие выпадашки при клике вне (wrapperRef)
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    if (isDropdownOpen) {
      document.addEventListener('click', handleClickOutside);
    }
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleSelect = (user: UserData) => {
    setIsDropdownOpen(false);
    setQuery('');
    setResults([]);
    if (onSelect) {
      onSelect(user);
    } else {
      if (myTelegramId && user.telegram_id === myTelegramId) {
        router.push(`/user/${user.telegram_id}`);
      } else {
        router.push(`/profile/${user.telegram_id}`);
      }
    }
  };

  return (
    <div ref={wrapperRef} style={{ position: 'relative', width: '100%' }}>
      {/* overlay удалён, теперь он в Header */}
      <input
        ref={inputRef}
        type="text"
        className="form-control"
        placeholder={placeholder}
        value={query}
        onChange={e => setQuery(e.target.value)}
        onFocus={() => { if (results.length > 0) setIsDropdownOpen(true); }}
        onBlur={() => setTimeout(() => setIsDropdownOpen(false), 150)}
        autoComplete="off"
      />
      {isDropdownOpen && (
        <div className="dropdown-menu show w-100 p-0 mt-1" style={{ maxHeight: 320, overflowY: 'auto', zIndex: 9999 }}>
          {loading && <div className="dropdown-item text-muted">Загрузка...</div>}
          {error && <div className="dropdown-item text-danger">{error}</div>}
          {!loading && !error && results.length === 0 && (
            <div className="dropdown-item text-muted">Ничего не найдено</div>
          )}
          {!loading && !error && results.map(user => (
            <button
              key={user.telegram_id}
              className="dropdown-item d-flex align-items-center"
              type="button"
              onClick={e => { e.preventDefault(); handleSelect(user); }}
            >
              <img
                src={user.avatar_img_url || '/assets/images/defaultAvatar.svg'}
                alt="avatar"
                width={32}
                height={32}
                className="rounded-circle me-2"
                style={{ objectFit: 'cover' }}
              />
              <span>
                <span className="fw-bold">{user.first_name} {user.last_name}</span>
                {user.username && <span className="text-muted ms-2">@{user.username}</span>}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserSearch; 