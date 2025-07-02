// frontend/src/context/UserContext.tsx
'use client'

import { createContext, useContext, useState, ReactNode } from 'react';

interface UserContextType {
  telegramId: number | null;
  setTelegramId: (id: number | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [telegramId, setTelegramId] = useState<number | null>(null);

  return (
    <UserContext.Provider value={{ telegramId, setTelegramId }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}