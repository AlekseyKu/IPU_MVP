// frontend\src\components\PromiseResultModal.tsx
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { X, Heart, Share2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface PromiseResultModalProps {
  onClose: () => void;
  result_content?: string;
  result_media_url?: string;
  completed_at?: string;
}

const PromiseResultModal: React.FC<PromiseResultModalProps> = ({ onClose, result_content, result_media_url, completed_at }) => {
  const { t } = useLanguage(); // "Инициализация перевода"
  const [mediaType, setMediaType] = useState<string | null>(null);

  // Блокируем прокрутку body при открытом модале
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = originalOverflow; };
  }, []);

  const handleShare = () => {
    if (navigator.share && (result_content || result_media_url)) {
      navigator.share({
        title: t('promiseResult.title'), // "Результат обещания"
        text: result_content || '',
        url: result_media_url || undefined,
      }).catch(() => {});
    } else {
      alert(t('common.shareUnavailable')); // "Поделиться недоступно на этом устройстве"
    }
  };

  // --- Определение типа медиа ---
  useEffect(() => {
    if (!result_media_url) return;
    fetch(result_media_url, { method: 'HEAD' })
      .then((res) => {
        const type = res.headers.get('Content-Type');
        if (type) setMediaType(type);
      })
      .catch((err) => {
        console.error('Error determining media type:', err);
      });
  }, [result_media_url]);
  
  // --- JSX ---
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
          maxWidth: '500px', position: 'relative', maxHeight: 'calc(100vh - 2rem)',
          overflowY: 'auto', pointerEvents: 'auto',
        }}
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none' }}
          aria-label={t('common.close')} // "Закрыть"
        >
          <X className="w-6 h-6" />
        </button>
        <h2 className="fw-bold mb-3">{t('promiseResult.title')}</h2> {/* "Результат обещания" */}
        {completed_at && (
          <div className="text-muted font-xsss mb-2">{t('promiseResult.completedOn')} {new Date(completed_at).toLocaleString('ru-RU')}</div> // "Завершено:"
        )}
        {result_content && (
          <div className="mb-3">
            <div className="text-dark lh-base">{result_content}</div>
          </div>
        )}
        {result_media_url && (
          <div className="mb-3">
            {mediaType?.startsWith('video') ? (
              <video src={result_media_url} controls className="w-100 rounded" style={{ maxHeight: '100vh', objectFit: 'cover' }} />
            ) : (
              <img src={result_media_url} alt="Результат" className="w-100 rounded" style={{ maxHeight: '100vh', objectFit: 'cover' }} />
            )}
          </div>
        )}
        <div className="d-flex justify-content-between align-items-center mt-2 gap-2">
          <button className="btn btn-outline-primary flex-grow-1" onClick={onClose}>{t('promiseResult.closeButton')}</button> {/* "Закрыть" */}
          <button className="btn btn-outline-primary align-items-center" style={{ minWidth: 44 }} title={t('common.like')}> {/* "Лайк" */}
            <Heart className="" size={20} />
          </button>
          <button className="btn btn-outline-primary align-items-center" style={{ minWidth: 44 }} title={t('common.share')} onClick={handleShare}> {/* "Поделиться" */}
            <Share2 className="" size={20} />
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default PromiseResultModal;
