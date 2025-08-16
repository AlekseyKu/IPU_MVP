// frontend/src/hooks/usePublicPosts.ts
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { PromiseData, ChallengeData, User } from '@/types';

export function usePublicPosts(currentUserId: number | null) {
  const [posts, setPosts] = useState<(PromiseData | ChallengeData)[]>([]); // Объединяем promises и challenges
  const [users, setUsers] = useState<Record<number, User>>({});
  const [subscriptions, setSubscriptions] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [displayedPosts, setDisplayedPosts] = useState<(PromiseData | ChallengeData)[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const postsPerPage = 10;

  useEffect(() => {
    let mounted = true;

    async function fetchData() {
      setIsLoading(true);
      try {
        const [
          { data: promiseData, error: pErr },
          { data: challengeData, error: cErr },
          { data: userData, error: uErr },
          subResult,
        ] = await Promise.all([
          supabase.from('promises').select('*').eq('is_public', true).order('created_at', { ascending: false }),
          supabase.from('challenges').select('*').eq('is_public', true).order('created_at', { ascending: false }),
          supabase.from('users').select('telegram_id, first_name, last_name, username, avatar_img_url'),
          currentUserId
            ? supabase.from('subscriptions').select('followed_id').eq('follower_id', currentUserId)
            : Promise.resolve({ data: [], error: null }),
        ]);

        if (!mounted) return;

        if (!pErr && !cErr) {
          const allPosts = [
            ...(promiseData || []),
            ...(challengeData || []),
          ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
          setPosts(allPosts);
          
          // Инициализируем отображаемые посты
          const initialPosts = allPosts.slice(0, postsPerPage);
          setDisplayedPosts(initialPosts);
          setHasMore(allPosts.length > postsPerPage);
          setCurrentPage(1);
        }
        if (!uErr) {
          const mapped = (userData || []).reduce((acc, u) => {
            if (u.telegram_id)
              acc[u.telegram_id] = {
                ...u,
                first_name: u.first_name || '',
                last_name: u.last_name || '',
                username: u.username || '',
                avatar_img_url: u.avatar_img_url || '',
              };
            return acc;
          }, {} as Record<number, User>);
          setUsers(mapped);
        }

        if (subResult?.data) {
          setSubscriptions(subResult.data.map((sub) => sub.followed_id));
        }
      } catch (error) {
        console.error('Ошибка загрузки:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();

    const promiseChannel = supabase
      .channel('public-promises')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'promises', filter: 'is_public=eq.true' }, (payload) => {
        const data = payload.new as PromiseData;
        setPosts((prev) => {
          const newPosts = [...prev];
          switch (payload.eventType) {
            case 'INSERT':
              newPosts.unshift(data);
              break;
            case 'UPDATE':
              const index = newPosts.findIndex((p) => p.id === data.id);
              if (index !== -1) newPosts[index] = data;
              break;
            case 'DELETE':
              return newPosts.filter((p) => p.id !== payload.old?.id);
          }
          const sortedPosts = newPosts.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
          
          // Обновляем отображаемые посты
          const newDisplayedPosts = sortedPosts.slice(0, currentPage * postsPerPage);
          setDisplayedPosts(newDisplayedPosts);
          setHasMore(sortedPosts.length > newDisplayedPosts.length);
          
          return sortedPosts;
        });
      })
      .subscribe();

    const challengeChannel = supabase
      .channel('public-challenges')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'challenges', filter: 'is_public=eq.true' }, (payload) => {
        const data = payload.new as ChallengeData;
        setPosts((prev) => {
          const newPosts = [...prev];
          switch (payload.eventType) {
            case 'INSERT':
              newPosts.unshift(data);
              break;
            case 'UPDATE':
              const index = newPosts.findIndex((p) => p.id === data.id);
              if (index !== -1) newPosts[index] = data;
              break;
            case 'DELETE':
              return newPosts.filter((p) => p.id !== payload.old?.id);
          }
          const sortedPosts = newPosts.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
          
          // Обновляем отображаемые посты
          const newDisplayedPosts = sortedPosts.slice(0, currentPage * postsPerPage);
          setDisplayedPosts(newDisplayedPosts);
          setHasMore(sortedPosts.length > newDisplayedPosts.length);
          
          return sortedPosts;
        });
      })
      .subscribe();

    // Подписка на обновления подписок (только если есть текущий пользователь)
    const subscriptionChannel = currentUserId 
      ? supabase
          .channel('subscriptions-updates')
          .on('postgres_changes', 
            { 
              event: '*', 
              schema: 'public', 
              table: 'subscriptions',
              filter: `follower_id=eq.${currentUserId}`
            }, 
            (payload) => {
              if (payload.eventType === 'INSERT') {
                setSubscriptions((prev) => [...prev, payload.new.followed_id]);
              } else if (payload.eventType === 'DELETE') {
                setSubscriptions((prev) => prev.filter(id => id !== payload.old.followed_id));
              }
            }
          )
          .subscribe()
      : null;

    return () => {
      mounted = false;
      supabase.removeChannel(promiseChannel);
      supabase.removeChannel(challengeChannel);
      if (subscriptionChannel) {
        supabase.removeChannel(subscriptionChannel);
      }
    };
  }, [currentUserId]);

  const loadMorePosts = () => {
    const nextPage = currentPage + 1;
    const startIndex = (nextPage - 1) * postsPerPage;
    const endIndex = startIndex + postsPerPage;
    const newPosts = posts.slice(startIndex, endIndex);
    
    setDisplayedPosts(prev => [...prev, ...newPosts]);
    setCurrentPage(nextPage);
    setHasMore(endIndex < posts.length);
  };

  return { 
    posts: displayedPosts, 
    users, 
    subscriptions, 
    isLoading, 
    hasMore, 
    loadMorePosts 
  };
}