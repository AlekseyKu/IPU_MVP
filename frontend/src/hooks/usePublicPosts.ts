// frontend/src/hooks/usePublicPosts.ts
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { PromiseData, ChallengeData, User } from "@/types";

export function usePublicPosts(
  currentUserId: number | null,
  onlySubscribedChallenges: boolean = false
) {
  const [posts, setPosts] = useState<(PromiseData | ChallengeData)[]>([]); // Объединяем promises и challenges
  const [users, setUsers] = useState<Record<number, User>>({});
  const [subscriptions, setSubscriptions] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [displayedPosts, setDisplayedPosts] = useState<
    (PromiseData | ChallengeData)[]
  >([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const postsPerPage = 10;
  const [subscribedChallengeIds, setSubscribedChallengeIds] = useState<
    number[]
  >([]);

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
          challengeSubsResult,
        ] = await Promise.all([
          supabase
            .from("promises")
            .select("*")
            .eq("is_public", true)
            .order("created_at", { ascending: false }),
          supabase
            .from("challenges")
            .select("*")
            .eq("is_public", true)
            .order("created_at", { ascending: false }),
          supabase
            .from("users")
            .select(
              "telegram_id, first_name, last_name, username, avatar_img_url"
            ),
          currentUserId
            ? supabase
                .from("subscriptions")
                .select("followed_id")
                .eq("follower_id", currentUserId)
            : Promise.resolve({ data: [], error: null }),
          currentUserId
            ? supabase
                .from("challenge_participants")
                .select("challenge_id")
                .eq("user_id", currentUserId)
            : Promise.resolve({ data: [], error: null }),
        ]);

        if (!mounted) return;

        if (!pErr && !cErr) {
          const allPosts = [
            ...(promiseData || []),
            ...(challengeData || []),
          ].sort(
            (a, b) =>
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime()
          );
          const subIds = (challengeSubsResult?.data || []).map(
            (r: any) => r.challenge_id
          );
          setSubscribedChallengeIds(currentUserId ? subIds : []);

          const basePosts = onlySubscribedChallenges
            ? allPosts.filter(
                (p) =>
                  "frequency" in p && subIds.includes((p as ChallengeData).id)
              )
            : allPosts;

          setPosts(basePosts);

          // Инициализируем отображаемые посты
          const initialPosts = basePosts.slice(0, postsPerPage);
          setDisplayedPosts(initialPosts);
          setHasMore(basePosts.length > postsPerPage);
          setCurrentPage(1);
        }
        if (!uErr) {
          const mapped = (userData || []).reduce(
            (acc, u) => {
              if (u.telegram_id)
                acc[u.telegram_id] = {
                  ...u,
                  first_name: u.first_name || "",
                  last_name: u.last_name || "",
                  username: u.username || "",
                  avatar_img_url: u.avatar_img_url || "",
                };
              return acc;
            },
            {} as Record<number, User>
          );
          setUsers(mapped);
        }

        if (subResult?.data) {
          setSubscriptions(subResult.data.map((sub) => sub.followed_id));
        }
      } catch (error) {
        console.error("Ошибка загрузки:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();

    const promiseChannel = supabase
      .channel("public-promises")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "promises",
          filter: "is_public=eq.true",
        },
        (payload) => {
          if (onlySubscribedChallenges) {
            // В режиме "мои подписки" игнорируем обещания, оставляем только челленджи
            return;
          }
          const data = payload.new as PromiseData;
          setPosts((prev) => {
            const newPosts = [...prev];
            switch (payload.eventType) {
              case "INSERT":
                newPosts.unshift(data);
                break;
              case "UPDATE":
                const index = newPosts.findIndex((p) => p.id === data.id);
                if (index !== -1) newPosts[index] = data;
                break;
              case "DELETE":
                return newPosts.filter((p) => p.id !== payload.old?.id);
            }
            const sortedPosts = newPosts.sort(
              (a, b) =>
                new Date(b.created_at).getTime() -
                new Date(a.created_at).getTime()
            );

            // Обновляем отображаемые посты
            const newDisplayedPosts = sortedPosts.slice(
              0,
              currentPage * postsPerPage
            );
            setDisplayedPosts(newDisplayedPosts);
            setHasMore(sortedPosts.length > newDisplayedPosts.length);

            return sortedPosts;
          });
        }
      )
      .subscribe();

    const challengeChannel = supabase
      .channel("public-challenges")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "challenges",
          filter: "is_public=eq.true",
        },
        (payload) => {
          const data = payload.new as ChallengeData;
          setPosts((prev) => {
            // Разрешаем только подписанные челленджи в режиме фильтра
            const allow =
              !onlySubscribedChallenges ||
              subscribedChallengeIds.includes(Number(data.id));
            const newPosts = [...prev];
            switch (payload.eventType) {
              case "INSERT":
                if (allow) newPosts.unshift(data);
                break;
              case "UPDATE":
                const index = newPosts.findIndex((p) => p.id === data.id);
                if (index !== -1) {
                  if (allow) {
                    newPosts[index] = data;
                  } else {
                    newPosts.splice(index, 1);
                  }
                } else if (allow) {
                  newPosts.unshift(data);
                }
                break;
              case "DELETE":
                return newPosts.filter((p) => p.id !== payload.old?.id);
            }
            const sortedPosts = newPosts
              .filter(
                (p) =>
                  !onlySubscribedChallenges ||
                  ("frequency" in p &&
                    subscribedChallengeIds.includes(
                      Number((p as ChallengeData).id)
                    ))
              )
              .sort(
                (a, b) =>
                  new Date(b.created_at).getTime() -
                  new Date(a.created_at).getTime()
              );

            // Обновляем отображаемые посты
            const newDisplayedPosts = sortedPosts.slice(
              0,
              currentPage * postsPerPage
            );
            setDisplayedPosts(newDisplayedPosts);
            setHasMore(sortedPosts.length > newDisplayedPosts.length);

            return sortedPosts;
          });
        }
      )
      .subscribe();

    // Подписка на обновления подписок (только если есть текущий пользователь)
    const subscriptionChannel = currentUserId
      ? supabase
          .channel("subscriptions-updates")
          .on(
            "postgres_changes",
            {
              event: "*",
              schema: "public",
              table: "subscriptions",
              filter: `follower_id=eq.${currentUserId}`,
            },
            (payload) => {
              if (payload.eventType === "INSERT") {
                setSubscriptions((prev) => [...prev, payload.new.followed_id]);
              } else if (payload.eventType === "DELETE") {
                setSubscriptions((prev) =>
                  prev.filter((id) => id !== payload.old.followed_id)
                );
              }
            }
          )
          .subscribe()
      : null;

    // Подписка на изменения подписанных челленджей в режиме фильтра
    const challSubsChannel = currentUserId
      ? supabase
          .channel("challenge-participants-updates")
          .on(
            "postgres_changes",
            {
              event: "*",
              schema: "public",
              table: "challenge_participants",
              filter: `user_id=eq.${currentUserId}`,
            },
            (payload) => {
              if (payload.eventType === "INSERT") {
                setSubscribedChallengeIds((prev) => [
                  ...prev,
                  payload.new.challenge_id,
                ]);
              } else if (payload.eventType === "DELETE") {
                setSubscribedChallengeIds((prev) =>
                  prev.filter((id) => id !== payload.old.challenge_id)
                );
              }
              if (onlySubscribedChallenges) {
                setPosts((prev) =>
                  prev.filter((p) =>
                    "frequency" in p
                      ? subscribedChallengeIds.includes(
                          Number((p as ChallengeData).id)
                        )
                      : false
                  )
                );
                setDisplayedPosts((prev) =>
                  prev.filter((p) =>
                    "frequency" in p
                      ? subscribedChallengeIds.includes(
                          Number((p as ChallengeData).id)
                        )
                      : false
                  )
                );
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
      if (challSubsChannel) {
        supabase.removeChannel(challSubsChannel);
      }
    };
  }, [currentUserId, onlySubscribedChallenges]);

  const loadMorePosts = () => {
    const nextPage = currentPage + 1;
    const startIndex = (nextPage - 1) * postsPerPage;
    const endIndex = startIndex + postsPerPage;
    const newPosts = posts.slice(startIndex, endIndex);

    setDisplayedPosts((prev) => [...prev, ...newPosts]);
    setCurrentPage(nextPage);
    setHasMore(endIndex < posts.length);
  };

  return {
    posts: displayedPosts,
    users,
    subscriptions,
    isLoading,
    hasMore,
    loadMorePosts,
  };
}
