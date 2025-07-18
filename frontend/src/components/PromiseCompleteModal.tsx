import React, { useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import { X, Image as ImageIcon } from 'lucide-react';

interface PromiseCompleteModalProps {
  onClose: () => void;
  onSubmit: (text: string, file: File | null) => void;
  loading: boolean;
}

const PromiseCompleteModal: React.FC<PromiseCompleteModalProps> = ({ onClose, onSubmit, loading }) => {
  const [text, setText] = useState('');
  const [media, setMedia] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setMedia(e.target.files[0]);
      setPreviewUrl(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleRemoveMedia = () => {
    setMedia(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return ReactDOM.createPortal(
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex',
      alignItems: 'center', justifyContent: 'center', padding: '1rem'
    }}>
      <div className="card shadow-xss rounded-xxl border-0 p-4 bg-white w-100"
        style={{ maxWidth: '500px', position: 'relative', maxHeight: 'calc(100vh - 2rem)', overflowY: 'auto' }}>
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none' }}
          aria-label="Закрыть"
        >
          <X className="w-6 h-6" />
        </button>
        <h2 className="fw-bold mb-3">Завершить обещание</h2>
        <p className="text-muted mb-3">Напишите результат обещания, прикрепите фото/видео при необходимости</p>
        {previewUrl && (
          <div className="mb-2 position-relative">
            {previewUrl.endsWith('.mp4') ? (
              <video controls className="w-100 rounded" style={{ maxHeight: '200px', objectFit: 'cover' }}>
                <source src={previewUrl} type="video/mp4" />
              </video>
            ) : (
              <img src={previewUrl} alt="Preview" className="w-100 rounded" style={{ maxHeight: '200px', objectFit: 'cover' }} />
            )}
            <button
              onClick={handleRemoveMedia}
              className="btn btn-sm btn-danger position-absolute"
              style={{ top: '5px', right: '5px' }}
              aria-label="Удалить медиа"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
        <form onSubmit={e => { e.preventDefault(); onSubmit(text, media); }}>
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Введите результат обещания"
            className="form-control mb-3 lh-30"
            style={{ height: '200px' }}
            required
          />
          <div className="mb-3">
            <label className="btn btn-outline-secondary w-100 d-flex align-items-center justify-content-center">
              <input
                type="file"
                accept="image/*,video/*"
                onChange={handleFileChange}
                className="d-none"
                ref={fileInputRef}
              />
              <ImageIcon className="me-2" />
              Прикрепить фото/видео
            </label>
          </div>
          <div className="d-flex justify-content-end gap-2">
            <button type="button" onClick={onClose} className="btn btn-light" disabled={loading}>
              Отмена
            </button>
            <button type="submit" className="btn btn-outline-primary" disabled={loading}>
              {loading ? 'Сохранение...' : 'Завершить'}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default PromiseCompleteModal;
