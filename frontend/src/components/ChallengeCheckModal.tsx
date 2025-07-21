import React, { useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import { X, Image as ImageIcon } from 'lucide-react';

interface ChallengeCheckModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (text: string, file: File | null) => Promise<void>;
}

const ChallengeCheckModal: React.FC<ChallengeCheckModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [text, setText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
        <button onClick={onClose} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none' }} aria-label="Закрыть">
          <X className="w-6 h-6" />
        </button>
        <h2 className="fw-bold mb-3">Вы начинаете челлендж!</h2>
        <p className="text-muted mb-3">Это ваш первый отчетный день — опишите его и дайте старт новым свершениям!</p>
        <form onSubmit={handleSubmit}>
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Ваш первый отчет..."
            required
            className="form-control mb-2"
            style={{ minHeight: 100 }}
          />
          {previewUrl && (
            <div className="mb-2 position-relative">
              {previewUrl.endsWith('.mp4') ? (
                <video controls src={previewUrl} className="w-100 rounded" style={{ maxHeight: 200 }} />
              ) : (
                <img src={previewUrl} alt="preview" className="w-100 rounded" style={{ maxHeight: 200 }} />
              )}
              <button type="button" onClick={handleRemoveMedia} className="btn btn-danger position-absolute" style={{ top: 5, right: 5 }}><X /></button>
            </div>
          )}
          <label className="btn btn-outline-secondary w-100 mb-2">
            <input type="file" accept="image/*,video/*" onChange={handleFileChange} className="d-none" ref={fileInputRef} />
            <ImageIcon className="me-2" /> Прикрепить фото/видео
          </label>
          <button type="submit" className="btn btn-primary w-100" disabled={loading}>
            {loading ? 'Сохраняем...' : 'Старт'}
          </button>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default ChallengeCheckModal; 