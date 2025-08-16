'use client'

import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { X } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { en } from '@/locales/en';
import { ru } from '@/locales/ru';

interface PrivacyModalProps {
  onClose: () => void;
}

const PrivacyModal: React.FC<PrivacyModalProps> = ({ onClose }) => {
  const { t, language } = useLanguage();
  
  // Получаем правильные переводы в зависимости от языка
  const translations = language === 'ru' ? ru.privacyPolicy : en.privacyPolicy;
  
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = originalOverflow; };
  }, []);

  return ReactDOM.createPortal(
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex',
      alignItems: 'center', justifyContent: 'center', padding: '1rem',
      pointerEvents: 'auto',
    }}>
      <div
        className="card shadow-xss rounded-xxl border-0 p-3 bg-white w-100 d-flex flex-column"
        style={{
          maxWidth: '600px', position: 'relative', maxHeight: 'calc(100vh - 2rem)',
          overflowY: 'auto', pointerEvents: 'auto',
        }}
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none' }}
          aria-label="Закрыть"
        >
          <X className="w-6 h-6" />
        </button>
        
        <h2 className="font-lg mb-3">{translations.title}</h2>
        
        <div className="privacy-content">
          <p className="mb-3">{translations.description}</p>
          
          <div className="mb-3">
            <p className="text-muted font-xsss">{translations.effectiveDate}</p>
            <p className="text-muted font-xsss">{translations.lastUpdated}</p>
            <p className="text-muted font-xsss">{translations.entity}</p>
            <p className="text-muted font-xsss">{translations.address}</p>
            <p className="text-muted font-xsss">{translations.contactEmail}</p>
          </div>

          <p className="mb-4">{translations.intro}</p>

          <h4>{translations.sections.whatWeCollect.title}</h4>
          <ul>
            {translations.sections.whatWeCollect.items.map((item: string, index: number) => (
              <li key={index}>{item}</li>
            ))}
          </ul>

          <h4>{translations.sections.whyWeCollect.title}</h4>
          <ul>
            {translations.sections.whyWeCollect.items.map((item: string, index: number) => (
              <li key={index}>{item}</li>
            ))}
          </ul>

          <h4>{translations.sections.legalBasis.title}</h4>
          <p>{translations.sections.legalBasis.text}</p>

          <h4>{translations.sections.dataSharing.title}</h4>
          <p>{translations.sections.dataSharing.text}</p>

          <h4>{translations.sections.dataStorage.title}</h4>
          <ul>
            {translations.sections.dataStorage.items.map((item: string, index: number) => (
              <li key={index}>{item}</li>
            ))}
          </ul>

          <h4>{translations.sections.internationalTransfers.title}</h4>
          <p>{translations.sections.internationalTransfers.text}</p>

          <h4>{translations.sections.cookies.title}</h4>
          <p>{translations.sections.cookies.text}</p>

          <h4>{translations.sections.yourRights.title}</h4>
          <ul>
            {translations.sections.yourRights.items.map((item: string, index: number) => (
              <li key={index}>{item}</li>
            ))}
          </ul>

          <h4>{translations.sections.changes.title}</h4>
          <p>{translations.sections.changes.text}</p>

          <p className="text-muted mt-4">
            <strong>{translations.sections.contact}</strong>
          </p>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default PrivacyModal; 