'use client'

import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { X } from 'lucide-react';

interface TermsModalProps {
  onClose: () => void;
}

const TermsModal: React.FC<TermsModalProps> = ({ onClose }) => {
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
        className="card shadow-xss rounded-xxl border-0 p-4 bg-white w-100 d-flex flex-column"
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
        
        <h2 className="font-lg mb-3">Условия использования</h2>
        
        <div className="terms-content">
          <h4>1. Принятие условий</h4>
          <p>Используя приложение IPU, вы соглашаетесь с настоящими условиями использования. Если вы не согласны с какими-либо положениями, не используйте приложение.</p>

          <h4>2. Описание сервиса</h4>
          <p>IPU — это социальная платформа для создания и выполнения обещаний, участия в челленджах и взаимодействия с другими пользователями.</p>

          <h4>3. Регистрация и аккаунт</h4>
          <ul>
            <li>Для использования приложения требуется регистрация через Telegram</li>
            <li>Вы несете ответственность за безопасность своего аккаунта</li>
            <li>Запрещается передавать доступ к аккаунту третьим лицам</li>
            <li>Мы оставляем за собой право приостановить или удалить аккаунт при нарушении условий</li>
          </ul>

          <h4>4. Правила поведения</h4>
          <p>Запрещается:</p>
          <ul>
            <li>Создавать контент, нарушающий права других пользователей</li>
            <li>Использовать приложение для незаконной деятельности</li>
            <li>Спамить или отправлять нежелательные сообщения</li>
            <li>Создавать фальшивые аккаунты или выдавать себя за других</li>
            <li>Нарушать интеллектуальные права</li>
          </ul>

          <h4>5. Контент пользователей</h4>
          <ul>
            <li>Вы сохраняете права на созданный контент</li>
            <li>Предоставляете нам лицензию на использование контента в рамках сервиса</li>
            <li>Несете ответственность за размещаемый контент</li>
            <li>Мы можем удалить контент, нарушающий условия использования</li>
          </ul>

          <h4>6. Ограничение ответственности</h4>
          <p>Приложение предоставляется "как есть" без каких-либо гарантий. Мы не несем ответственности за:</p>
          <ul>
            <li>Потерю данных или сбои в работе</li>
            <li>Действия других пользователей</li>
            <li>Ущерб от использования приложения</li>
          </ul>

          <h4>7. Изменения условий</h4>
          <p>Мы оставляем за собой право изменять настоящие условия. Пользователи будут уведомлены об изменениях через приложение.</p>

          <h4>8. Прекращение использования</h4>
          <p>Вы можете прекратить использование приложения в любое время. Мы можем приостановить или удалить ваш аккаунт при нарушении условий.</p>

          <h4>9. Контакты</h4>
          <p>По вопросам, связанным с условиями использования, обращайтесь: info@dexsa.site</p>

          <p className="text-muted mt-4">
            <small>Последнее обновление: {new Date().toLocaleDateString('ru-RU')}</small>
          </p>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default TermsModal; 