'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Globe } from 'lucide-react';

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  const handleLanguageChange = () => {
    const newLanguage = language === 'ru' ? 'en' : 'ru';
    setLanguage(newLanguage);
  };

  return (
    <button
      onClick={handleLanguageChange}
      className="btn btn-outline-primary btn-sm d-flex align-items-center gap-2"
      title={language === 'ru' ? 'Switch to English' : 'Переключить на русский'}
    >
      <Globe size={16} />
      <span>{language === 'ru' ? 'EN' : 'RU'}</span>
    </button>
  );
} 