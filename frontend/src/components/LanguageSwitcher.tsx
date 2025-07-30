'use client'

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Globe } from 'lucide-react';

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();

  const handleLanguageChange = () => {
    const newLanguage = language === 'ru' ? 'en' : 'ru';
    setLanguage(newLanguage);
  };

  return (
    <button
      onClick={handleLanguageChange}
      className="btn btn-outline-primary btn-sm d-flex align-items-center gap-2"
      title={t('settings.language')}
    >
      <Globe size={16} />
      <span>{language.toUpperCase()}</span>
    </button>
  );
};

export default LanguageSwitcher; 