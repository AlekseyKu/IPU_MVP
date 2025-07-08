// frontend/src/app/list/page.tsx
'use client'

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { User, PromiseData } from '@/types';
import { Activity, Ellipsis, CircleStop, CirclePlay } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/Header';
import Appfooter from '@/components/Appfooter';


const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ListPage() {
  const [promises, setPromises] = useState<PromiseData[]>([]);
  const [users, setUsers] = useState<Record<string, User>>({});
  const [isOpen, setIsOpen] = useState<Record<string, boolean>>({}); // Состояние для раскрытия обещания
  const [menuOpen, setMenuOpen] = useState<Record<string, boolean>>({}); // Состояние для меню
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        // Fetch all promises
        const { data: promisesData, error: promisesError } = await supabase
          .from('promises')
          .select('*')
          .order('created_at', { ascending: false });
        if (promisesError) {
          console.error('Error fetching promises:', promisesError.message);
        } else {
          setPromises(promisesData || []);
        }

        // Fetch all users
        const { data: usersData, error: usersError } = await supabase
          .from('users')
          .select('telegram_id, first_name, last_name, username');
        if (usersError) {
          console.error('Error fetching users:', usersError.message);
        } else {
          const usersMap = usersData.reduce((acc, user) => {
            acc[user.telegram_id] = {
              telegram_id: user.telegram_id,
              first_name: user.first_name || '',
              last_name: user.last_name || '',
              nickname: user.username || '',
            };
            return acc;
          }, {} as Record<string, User>);
          setUsers(usersMap);
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
        { event: 'INSERT', schema: 'public', table: 'promises' },
        (payload) => {
          setPromises((prev) => [payload.new as PromiseData, ...prev]);
        }
      )
      .subscribe();

    const updateSubscription = supabase
      .channel('promises-update-all')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'promises' },
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
  }, []);

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

  return (
    <>
      <Header />
      <div className="main-content">
        <div className="middle-sidebar-bottom">
          <div className="middle-sidebar-left pe-0">
            <div className="row">
              <div className="col-12">
                <AnimatePresence>
                  {promises.map((promise) => {
                    const user = users[promise.user_id] || { first_name: '', last_name: '', nickname: '' };
                    const fullName = `${user.first_name} ${user.last_name}`.trim() || user.nickname || 'Guest';

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
                            <Activity className="w-6 h-6 me-2" />
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