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
import Postview from '@/components/Postview'; // Импортируем компонент

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
                    const user = users[promise.user_id] || { first_name: '', last_name: '', username: '', avatar_img_url: '' };
                    const fullName = `${user.first_name} ${user.last_name}`.trim() || user.username || 'Guest';
                    const isOwnProfile = currentUserId === promise.user_id;

                    return (
                      <motion.div
                        key={promise.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                      >
                        <Postview
                          promise={promise}
                          onToggle={() => toggleOpen(promise.id)}
                          isOpen={!!isOpen[promise.id]}
                          onUpdate={() => {}} // Пустая функция по умолчанию
                          onDelete={() => {}} // Пустая функция по умолчанию
                          isOwnProfile={isOwnProfile}
                          isList={true} // Указываем, что это список
                          avatarUrl={user.avatar_img_url}
                          userId={promise.user_id}
                          userName={fullName}
                        />
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