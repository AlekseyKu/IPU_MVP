'use client'

import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { X } from 'lucide-react';

interface PrivacyModalProps {
  onClose: () => void;
}

const PrivacyModal: React.FC<PrivacyModalProps> = ({ onClose }) => {
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
        
        <h2 className="font-lg mb-3">Политика конфиденциальности</h2>
        
        <div className="privacy-content">
          <h4>1. Сбор информации</h4>
          <p>Мы собираем информацию, которую вы предоставляете при использовании приложения IPU, включая:</p>
          <ul>
            <li>Данные профиля (имя, фото профиля)</li>
            <li>Информацию о созданных обещаниях и челленджах</li>
            <li>Данные о взаимодействии с другими пользователями</li>
          </ul>

          <h4>2. Использование информации</h4>
          <p>Собранная информация используется для:</p>
          <ul>
            <li>Предоставления и улучшения сервисов приложения</li>
            <li>Персонализации пользовательского опыта</li>
            <li>Обеспечения безопасности аккаунта</li>
            <li>Отправки уведомлений о важных событиях</li>
          </ul>

          <h4>3. Защита данных</h4>
          <p>Мы принимаем все необходимые меры для защиты ваших персональных данных от несанкционированного доступа, изменения, раскрытия или уничтожения.</p>

          <h4>4. Передача данных</h4>
          <p>Мы не продаем, не обмениваем и не передаем ваши персональные данные третьим лицам без вашего согласия, за исключением случаев, предусмотренных законодательством.</p>

          <h4>5. Ваши права</h4>
          <p>Вы имеете право:</p>
          <ul>
            <li>Получить доступ к своим персональным данным</li>
            <li>Исправить неточные данные</li>
            <li>Удалить свои данные</li>
            <li>Отозвать согласие на обработку данных</li>
          </ul>

          <h4>6. Контакты</h4>
          <p>По вопросам, связанным с обработкой персональных данных, обращайтесь к нам по адресу: info@dexsa.site</p>

          <p className="text-muted mt-4">
            <small>Последнее обновление: {new Date().toLocaleDateString('ru-RU')}</small>
          </p>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default PrivacyModal; 