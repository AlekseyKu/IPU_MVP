// frontend/src/context/UserContext.tsx
'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface UserContextType {
  telegramId: number | null;
  initData: string | null;
  setTelegramId: (id: number | null) => void;
  setInitData: (data: string | null) => void;
}

interface CreatePostModalContextType {
  isCreatePostOpen: boolean;
  setIsCreatePostOpen: (open: boolean) => void;
}

interface CreateChallengeModalContextType {
  isCreateChallengeOpen: boolean;
  setIsCreateChallengeOpen: (open: boolean) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);
const CreatePostModalContext = createContext<CreatePostModalContextType | undefined>(undefined);
const CreateChallengeModalContext = createContext<CreateChallengeModalContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [telegramId, setTelegramIdState] = useState<number | null>(null);
  const [initData, setInitDataState] = useState<string | null>(null);

  useEffect(() => {
    const storedId = localStorage.getItem('telegramId');
    const storedInit = localStorage.getItem('initData');
    if (storedId) setTelegramIdState(Number(storedId));
    if (storedInit) setInitDataState(storedInit);
  }, []);

  const setTelegramId = (id: number | null) => {
    setTelegramIdState(id);
    if (id !== null) {
      localStorage.setItem('telegramId', id.toString());
    } else {
      localStorage.removeItem('telegramId');
    }
  };

  const setInitData = (data: string | null) => {
    setInitDataState(data);
    if (data !== null) {
      localStorage.setItem('initData', data);
    } else {
      localStorage.removeItem('initData');
    }
  };

  return (
    <UserContext.Provider value={{ telegramId, initData, setTelegramId, setInitData }}>
      {children}
    </UserContext.Provider>
  );
}

export function CreatePostModalProvider({ children }: { children: ReactNode }) {
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);

  return (
    <CreatePostModalContext.Provider value={{ isCreatePostOpen, setIsCreatePostOpen }}>
      {children}
    </CreatePostModalContext.Provider>
  );
}

export function CreateChallengeModalProvider({ children }: { children: ReactNode }) {
  const [isCreateChallengeOpen, setIsCreateChallengeOpen] = useState(false);

  return (
    <CreateChallengeModalContext.Provider value={{ isCreateChallengeOpen, setIsCreateChallengeOpen }}>
      {children}
    </CreateChallengeModalContext.Provider>
  );
}

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}

export const useCreatePostModal = (): CreatePostModalContextType => {
  const context = useContext(CreatePostModalContext);
  if (context === undefined) {
    throw new Error('useCreatePostModal must be used within a CreatePostModalProvider');
  }
  return context;
}

export const useCreateChallengeModal = (): CreateChallengeModalContextType => {
  const context = useContext(CreateChallengeModalContext);
  if (context === undefined) {
    throw new Error('useCreateChallengeModal must be used within a CreateChallengeModalProvider');
  }
  return context;
}