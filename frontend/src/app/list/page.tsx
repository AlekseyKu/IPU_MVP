// frontend/src/app/list/page.tsx
'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { User, PromiseData } from '@/types';
import { Activity, Ellipsis, CircleStop, CirclePlay } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/Header';
import Appfooter from '@/components/Appfooter';
import Link from 'next/link';
import { useUser } from '@/context/UserContext';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ListPage() {
  const [promises, setPromises] = useState<PromiseData[]>([]);
  const [users, setUsers] = useState<Record<string, User>>({});
  const [isOpen, setIsOpen] = useState<Record<string, boolean>>({});
  const [menuOpen, setMenuOpen] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [showSubscribedOnly, setShowSubscribedOnly] = useState(false);
  const [subscriptions, setSubscriptions] = useState<number[]>([]);
  const router = useRouter();
  const { telegramId: currentUserId } = useUser() || { telegramId: null }; // Используем useUser

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const [promisesResponse, usersResponse, subscriptionsResponse] = await Promise.all([
          supabase.from('promises').select('*').eq('is_public', true).order('created_at', { ascending: false }),
          supabase.from('users').select('telegram_id, first_name, last_name, username, avatar_img_url'),
          currentUserId ? supabase.from('subscriptions').select('followed_id').eq('follower_id', currentUserId) : { data: [], error: null },
        ]);

        if (promisesResponse.error) {
          console.error('Error fetching promises:', promisesResponse.error.message);
        } else {
          setPromises(promisesResponse.data || []);
        }

        if (usersResponse.error) {
          console.error('Error fetching users:', usersResponse.error.message);
        } else {
          const usersMap = usersResponse.data.reduce((acc, user) => {
            acc[user.telegram_id] = {
              telegram_id: user.telegram_id,
              first_name: user.first_name || '',
              last_name: user.last_name || '',
              username: user.username || '',
              avatar_img_url: user.avatar_img_url || '',
            };
            return acc;
          }, {} as Record<string, User>);
          setUsers(usersMap);
        }

        if (subscriptionsResponse.error) {
          console.error('Error fetching subscriptions:', subscriptionsResponse.error.message);
        } else if (subscriptionsResponse.data) {
          setSubscriptions(subscriptionsResponse.data.map((sub) => sub.followed_id));
        }
      } catch (error) {
        console.error('General error:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();

    const insertSubscription = supabase
      .channel('promises-insert-all')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'promises', filter: 'is_public=eq.true' },
        (payload) => {
          setPromises((prev) => [payload.new as PromiseData, ...prev]);
        }
      )
      .subscribe();

    const updateSubscription = supabase
      .channel('promises-update-all')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'promises', filter: 'is_public=eq.true' },
        (payload) => {
          setPromises((prev) =>
            prev.map((p) => (p.id === payload.new.id ? (payload.new as PromiseData) : p))
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(insertSubscription);
      supabase.removeChannel(updateSubscription);
    };
  }, [currentUserId]);

  if (isLoading) {
    return <div className="text-center p-5">Loading...</div>;
  }

  const toggleOpen = (id: string) => {
    setIsOpen((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleMenu = (id: string) => {
    setMenuOpen((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const copyLink = (id: string) => {
    const link = `${window.location.origin}/promise/${id}`;
    navigator.clipboard.writeText(link).then(() => alert('Ссылка скопирована!'));
    setMenuOpen((prev) => ({ ...prev, [id]: false }));
  };

  const share = (promise: PromiseData) => {
    const shareData = {
      title: promise.title,
      text: promise.content,
      url: `${window.location.origin}/promise/${promise.id}`,
    };
    if (navigator.share) {
      navigator.share(shareData).catch((error) => console.error('Error sharing:', error));
    } else {
      alert('Поделиться недоступно на этом устройстве');
    }
    setMenuOpen((prev) => ({ ...prev, [promise.id]: false }));
  };

  // Синхронная фильтрация с использованием локального состояния subscriptions
  const filteredPromises = showSubscribedOnly && currentUserId
    ? promises.filter((promise) => subscriptions.includes(promise.user_id))
    : promises;

  return (
    <>
      <Header />
      <div className="main-content">
        <div className="middle-sidebar-bottom">
          <div className="middle-sidebar-left pe-0">
            <div className="row">
              <div className="col-12 px-3 py-1">
                <div className="form-check form-switch">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    style={{ transform: 'scale(1.4)'}}
                    checked={showSubscribedOnly}
                    onChange={(e) => setShowSubscribedOnly(e.target.checked)}
                    id="showSubscribedOnly"
                  />
                  <label className="form-check-label ms-1" htmlFor="showSubscribedOnly">
                    Мои подписки
                  </label>
                </div>
              </div>
              <div className="col-12">
                <AnimatePresence>
                  {filteredPromises.map((promise) => {
                    const user = users[promise.user_id] || { first_name: '', last_name: '', username: '' };
                    const fullName = `${user.first_name} ${user.last_name}`.trim() || user.username || 'Guest';

                    return (
                      <motion.div
                        key={promise.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                        className="card w-100 shadow-sm rounded-xxl border-0 px-4 py-3 mb-3 position-relative"
                        onClick={() => toggleOpen(promise.id)}
                      >
                        <div className="card-body p-0 d-flex flex-column">
                          <div className="d-flex align-items-center mb-2">
                            <Link href={`/profile/${promise.user_id}`}>
                              <img
                                src={user.avatar_img_url || '/assets/images/defaultAvatar.png'}
                                alt="avatar"
                                width={32}
                                height={32}
                                className="rounded-circle me-2"
                              />
                            </Link>
                            <span className="text-dark font-xsss">{fullName}</span>
                          </div>

                          <div className="flex-grow-1">
                            <span className="text-dark font-xs mb-1">{promise.title}</span>
                          </div>
                          <div className="d-flex justify-content-between align-items-center">
                            <span className="text-muted font-xsss">Дэдлайн: {new Date(promise.deadline).toLocaleString([], {
                              year: '2-digit',
                              month: '2-digit',
                              day: '2-digit',
                              hour: '2-digit',
                              minute: '2-digit',
                              hour12: false,
                            })}</span>
                            <div className="d-flex align-items-center text-nowrap">
                              <span className="text-muted font-xsss me-1">
                                {promise.is_completed ? 'Завершено' : 'Активно'}
                              </span>
                              {promise.is_completed ? (
                                <CircleStop className="w-3 h-3 text-accent" />
                              ) : (
                                <CirclePlay className="w-3 h-3 text-primary" />
                              )}
                            </div>
                          </div>
                        </div>
                        {isOpen[promise.id] && (
                          <div className="mt-3">
                            <p className="text-muted lh-sm small mb-2">{promise.content}</p>
                            {promise.media_url && (
                              <div className="mb-3">
                                {promise.media_url.endsWith('.mp4') ? (
                                  <video controls className="w-100 rounded">
                                    <source src={promise.media_url} type="video/mp4" />
                                  </video>
                                ) : (
                                  <img src={promise.media_url} alt="Attached media" className="w-100 rounded" />
                                )}
                              </div>
                            )}
                            <span className="text-muted small">Создано: {new Date(promise.created_at).toLocaleString([], {
                              year: '2-digit',
                              month: '2-digit',
                              day: '2-digit',
                              hour: '2-digit',
                              minute: '2-digit',
                              hour12: false,
                            })}</span>
                            <div className="position-absolute bottom-0 end-0 mb-3 me-4">
                              <Ellipsis
                                className="cursor-pointer text-muted"
                                size={20}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleMenu(promise.id);
                                }}
                              />
                              {isOpen[promise.id] && menuOpen[promise.id] && (
                                <div className="dropdown-menu show p-2 bg-white font-xsss border rounded shadow-sm position-absolute end-0 mt-1">
                                  <button className="dropdown-item" onClick={() => router.push(`/profile/${promise.user_id}`)}>
                                    Посмотреть профиль
                                  </button>
                                  <button className="dropdown-item" onClick={() => copyLink(promise.id)}>
                                    Скопировать ссылку
                                  </button>
                                  <button className="dropdown-item" onClick={() => share(promise)}>
                                    Отправить
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Appfooter />
    </>
  );
}