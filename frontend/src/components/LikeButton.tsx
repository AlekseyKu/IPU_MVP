// frontend/src/components/LikeButton.tsx
'use client'

import React, { useEffect } from 'react';
import { Heart } from 'lucide-react';
import { useLikes } from '@/hooks/useLikes';

interface LikeButtonProps {
  postId: string;
  postType: 'promise' | 'challenge';
  className?: string;
  size?: number;
}

const LikeButton: React.FC<LikeButtonProps> = ({ 
  postId, 
  postType, 
  className = '', 
  size = 20 
}) => {
  const { likesCount, isLiked, isLoading, toggleLike } = useLikes(postId, postType);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Предотвращаем всплытие события
    if (!isLoading) {
      toggleLike();
    }
  };

  return (
    <div className={`d-flex align-items-center ${className}`}>
      <button
        onClick={handleClick}
        disabled={isLoading}
        className={`btn btn-link p-0 me-1 ${isLiked ? 'text-danger' : 'text-muted'}`}
        style={{ 
          border: 'none', 
          background: 'none',
          cursor: isLoading ? 'not-allowed' : 'pointer'
        }}
        title={isLiked ? 'Убрать лайк' : 'Поставить лайк'}
      >
        <Heart 
          size={size} 
          fill={isLiked ? 'currentColor' : 'none'}
          className={isLoading ? 'opacity-50' : ''}
        />
      </button>
      {likesCount > 0 && (
        <span className="text-muted font-xsss">
          {likesCount}
        </span>
      )}
    </div>
  );
};

export default LikeButton; 