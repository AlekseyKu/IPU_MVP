'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  const handleLanguageChange = () => {
    const newLanguage = language === 'ru' ? 'en' : 'ru';
    setLanguage(newLanguage);
  };

  return (
    <div className="language-switcher">
      <span className="switcher switcher-2">
        <input 
          type="checkbox" 
          id="language-switcher"
          checked={language === 'en'}
          onChange={handleLanguageChange}
        />
        <label htmlFor="language-switcher"></label>
      </span>
      <style jsx>{`
        .language-switcher {
          display: flex;
          align-items: start;
          justify-content: start;
          padding-left: 30px;
        }
        
        .switcher {
          position: relative;
          width: 80px;
          height: 32px;
          border-radius: 0.375rem;
          margin: 0;
        }
        
        .switcher input {
          appearance: none;
          position: relative;
          width: 80px;
          height: 32px;
          border-radius: 0.375rem;
          background-color: #fff;
          border: 1px solid #007bff;
          outline: none;
          cursor: pointer;
          font-family: inherit;
          transition: background-color 0s .3s;
        }
        
        .switcher input:before,
        .switcher input:after {
          z-index: 2;
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          font-size: 10px;
          font-weight: 600;
          pointer-events: none;
        }
        
        .switcher input:before {
          content: 'RU';
          left: 12px;
          color: #007bff;
        }
        
        .switcher input:after {
          content: 'EN';
          right: 12px;
          color: #ffffff;
        }
        
        .switcher label {
          z-index: 1;
          position: absolute;
          top: 0px;
          width: 80px;
          height: 32px;
          border-radius: 0.375rem;
          pointer-events: none;
        }
        
        .switcher.switcher-2 {
          overflow: hidden;
        }
        
        .switcher.switcher-2 input:checked {
          background-color: #007bff;
        }
        
        .switcher.switcher-2 input:checked + label {
          background: #007bff;
          animation: turn-on .3s ease-out;
        }
        
        .switcher.switcher-2 input:not(:checked) {
          background: #fff;
        }
        
        .switcher.switcher-2 input:not(:checked) + label {
          background: #fff;
          animation: turn-off .3s ease-out;
        }
        
        @keyframes turn-on {
          0% {
            left: 100%;
          }
          100% {
            left: 0%;
          }
        }
        
        @keyframes turn-off {
          0% {
            right: 100%;
          }
          100% {
            right: 0%;
          }
        }
      `}</style>
    </div>
  );
} 