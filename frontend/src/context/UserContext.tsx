// frontend/src/context/UserContext.tsx
'use client'

import { createContext, useContext, useState, ReactNode } from 'react';

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

const UserContext = createContext<UserContextType | undefined>(undefined);
const CreatePostModalContext = createContext<CreatePostModalContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [telegramId, setTelegramId] = useState<number | null>(null);
  const [initData, setInitData] = useState<string | null>(null);

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