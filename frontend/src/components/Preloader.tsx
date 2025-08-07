// frontend/src/components/Preloader.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface PreloaderProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  minLoadingTime?: number; // минимальное время загрузки в миллисекундах
}

const Preloader: React.FC<PreloaderProps> = ({ 
  size = 'md', 
  className = '',
  minLoadingTime = 1000 // 1 секунда по умолчанию
}) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(true);
    }, minLoadingTime);

    return () => clearTimeout(timer);
  }, [minLoadingTime]);

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return { logo: 'w-8 h-8', size: 32 };
      case 'md':
        return { logo: 'w-12 h-12', size: 48 };
      case 'lg':
        return { logo: 'w-16 h-16', size: 64 };
      default:
        return { logo: 'w-12 h-12', size: 48 };
    }
  };

  const sizeClasses = getSizeClasses();

  // Показываем статичный логотип первые minLoadingTime миллисекунд
  if (!show) {
    return (
      <div className={`flex items-center justify-center w-full h-full ${className}`}>
        <div 
          className={`${sizeClasses.logo}`}
          style={{ width: `${sizeClasses.size}px`, height: `${sizeClasses.size}px` }}
        >
          <img
            src="/assets/images/ipu/logo_200.png"
            alt="IPU Logo"
            className="w-full h-full object-contain"
            style={{ width: '100%', height: '100%' }}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/assets/images/ipu/logo_200.png";
            }}
          />
        </div>
      </div>
    );
  }

  // После minLoadingTime показываем анимированный логотип
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`flex items-center justify-center w-full h-full ${className}`}
    >
      {/* Анимированный логотип */}
      <motion.div
        animate={{ 
          scale: [1, 1.1, 1]
        }}
        transition={{ 
          scale: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
        }}
        className={`${sizeClasses.logo}`}
        style={{ width: `${sizeClasses.size}px`, height: `${sizeClasses.size}px` }}
      >
        <img
          src="/assets/images/ipu/logo_200.png"
          alt="IPU Logo"
          className="w-full h-full object-contain"
          style={{ width: '100%', height: '100%' }}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "/assets/images/ipu/logo_200.png";
          }}
        />
      </motion.div>
    </motion.div>
  );
};

export default Preloader; 