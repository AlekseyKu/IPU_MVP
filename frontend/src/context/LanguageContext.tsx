'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { locales, type Locale, getMessages } from '@/i18n';

interface LanguageContextType {
  language: Locale;
  setLanguage: (lang: Locale) => void;
  t: (key: string) => string;
  messages: any;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Locale>('ru');

  // Загружаем язык из localStorage при инициализации
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Locale;
    if (savedLanguage && (savedLanguage === 'ru' || savedLanguage === 'en')) {
      setLanguageState(savedLanguage);
    }
  }, []);

  const setLanguage = (lang: Locale) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  // Функция для получения переводов
  const t = (key: string): string => {
    const messages = getMessages(language);
    const keys = key.split('.');
    let value: any = messages;
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return key; // Возвращаем ключ если перевод не найден
      }
    }
    
    return typeof value === 'string' ? value : key;
  };

  const value: LanguageContextType = {
    language,
    setLanguage,
    t,
    messages: getMessages(language)
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
} 