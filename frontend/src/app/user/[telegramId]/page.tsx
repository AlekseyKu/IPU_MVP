// frontend/src/app/user/[telegramId]/page.tsx
'use client';

import { useEffect, useState } from 'react';

export default function UserPage({ params }: { params: { telegramId: string } }) {
  const [user, setUser] = useState<{ telegram_id: number; username: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchUser = async () => {
      const telegramId = parseInt(params.telegramId, 10);
      if (isNaN(telegramId)) {
        if (isMounted) setError('Invalid telegramId');
        return;
      }

      try {
        const res = await fetch(`/api/user/${telegramId}`);
        if (!res.ok) throw new Error('User not found');
        const data = await res.json();
        if (isMounted) setUser(data);
      } catch (err) {
        if (isMounted) setError((err as Error).message);
      }
    };

    fetchUser();

    return () => {
      isMounted = false;
    };
  }, []); // Убрали params.telegramId из зависимостей

  if (error) return <div>Error: {error}</div>;
  if (!user) return <div>Loading...</div>;
  return <div>Welcome, {user.username}!</div>;
}