'use client'

import React, { useEffect, useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import { X, ChevronDown, ChevronUp } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { en } from '@/locales/en';
import { ru } from '@/locales/ru';

interface FaqModalProps {
  onClose: () => void;
}

interface FaqItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}

const FaqItem: React.FC<FaqItemProps> = ({ question, answer, isOpen, onToggle }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState<number>(0);

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, [answer]);

  return (
    <div className="faq-item border-bottom mb-3">
      <button
        onClick={onToggle}
        className="w-100 text-start d-flex justify-content-between align-items-center p-3 bg-transparent border-0"
        style={{ cursor: 'pointer' }}
      >
        <span className="font-xsss">{question}</span>
        {isOpen ? (
          <ChevronUp className="w-5 h-5" />
        ) : (
          <ChevronDown className="w-5 h-5" />
        )}
      </button>
      <div
        className="faq-answer overflow-hidden transition-all duration-300 ease-in-out"
        style={{
          maxHeight: isOpen ? `${contentHeight}px` : '0px',
          opacity: isOpen ? 1 : 0,
        }}
      >
        <div ref={contentRef} className="px-3 pb-3">
          <p 
            className="text-muted font-xsss mb-0"
            style={{ whiteSpace: 'pre-line' }}
          >
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
};

const FaqModal: React.FC<FaqModalProps> = ({ onClose }) => {
  const { t, language } = useLanguage();
  
  // Получаем правильные переводы в зависимости от языка
  const translations = language === 'ru' ? ru.faq : en.faq;
  
  // Состояние для открытых/закрытых вопросов
  const [openItems, setOpenItems] = useState<{ [key: string]: boolean }>({});
  
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = originalOverflow; };
  }, []);

  const toggleItem = (sectionKey: string, itemIndex: number) => {
    const key = `${sectionKey}-${itemIndex}`;
    setOpenItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

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
        
        <h2 className="font-lg mb-3 me-3">{translations.title}</h2>
        
        <div className="faq-content">
          {Object.entries(translations.sections).map(([sectionKey, section]) => (
                         <div key={sectionKey} className="mb-4">
               <h4 className="mb-3">{section.title}</h4>
              {section.questions.map((item, index) => (
                <FaqItem
                  key={`${sectionKey}-${index}`}
                  question={item.question}
                  answer={item.answer}
                  isOpen={openItems[`${sectionKey}-${index}`] || false}
                  onToggle={() => toggleItem(sectionKey, index)}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default FaqModal;
