import React, { useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import { X, Image as ImageIcon } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface ChallengeCheckModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (text: string, file: File | null) => Promise<void>;
  title?: string;
  description?: string;
  buttonText?: string;
}

const ChallengeCheckModal: React.FC<ChallengeCheckModalProps> = ({ isOpen, onClose, onSubmit, title, description, buttonText }) => {
  const [text, setText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t } = useLanguage();

  if (!isOpen || typeof window === 'undefined') return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
      setPreviewUrl(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleRemoveMedia = () => {
    setFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await onSubmit(text, file);
    setLoading(false);
    setText('');
    setFile(null);
    setPreviewUrl(null);
    onClose();
  };

  return ReactDOM.createPortal(
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(0,0,0,0.5)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflowY: 'auto',
      padding: '1rem',
    }}>
      <div className="card shadow-xss rounded-xxl border-0 p-4 bg-white w-100" style={{ maxWidth: 500, position: 'relative', maxHeight: 'calc(100vh - 2rem)', overflowY: 'auto' }}>
        {/* Кнопка закрытия модального окна */}
        <button onClick={onClose} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none' }} aria-label={t('common.close')}>
          <X className="w-6 h-6" />
        </button>
        
        {/* Заголовок модального окна */}
        {/* "Челлендж продолжается!" */}
        <h2 className="fw-bold mb-3">{title || t('challengeProgress.title')}</h2>
        
        {/* Описание модального окна */}
        {/* "Вы на верном пути — сделайте отчёт и станьте на шаг ближе к цели!" */}
        <p className="text-muted mb-3">{description || t('challengeProgress.subtitle')}</p>
        
        <form onSubmit={handleSubmit}>
          {/* Поле для ввода отчета */}
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            // {/* "Ваш отчёт" */}
            placeholder={t('challengeProgress.report')}
            required
            className="form-control mb-2 lh-30"
            style={{ height: 200 }}
          />
          
          {/* Предварительный просмотр медиафайла */}
          {previewUrl && (
            <div className="mb-2 position-relative">
              {previewUrl.endsWith('.mp4') ? (
                <video controls src={previewUrl} className="w-100 rounded" style={{ maxHeight: 200 }} />
              ) : (
                <img src={previewUrl} alt="preview" className="w-100 rounded" style={{ maxHeight: 200 }} />
              )}
              {/* Кнопка удаления медиафайла */}
              <button type="button" onClick={handleRemoveMedia} className="btn btn-danger position-absolute" style={{ top: 5, right: 5 }}><X /></button>
            </div>
          )}
          
          {/* Кнопка прикрепления медиафайла */}
          <label className="btn btn-outline-secondary w-100 mb-2">
            <input type="file" accept="image/*,video/*" onChange={handleFileChange} className="d-none" ref={fileInputRef} />
            <ImageIcon className="me-2" /> 
            {/* "Прикрепить фото/видео" */}
            {t('challengeProgress.media')}
          </label>
          
          {/* Кнопка отправки отчета */}
          <button type="submit" className="btn btn-primary w-100" disabled={loading}>
            {loading ? t('common.loading') : (buttonText || t('challengeProgress.submitButton'))}
          </button>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default ChallengeCheckModal; 