// frontend/src/components/LeaderCard.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, HeartHandshake } from 'lucide-react';
import { LeaderData } from '@/hooks/useLeaders';
import Link from 'next/link';

interface LeaderCardProps {
  leader: LeaderData;
  index: number;
}

const LeaderCard: React.FC<LeaderCardProps> = ({ leader, index }) => {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="text-secondary mb-1" size={16} />;
      case 2:
        return <Trophy className="text-secondary mb-1" size={14} />;
      case 3:
        return <Trophy className="text-secondary mb-1" size={12} />;
      default:
        return <span className="text-gray text-xssss">{rank}</span>;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="card w-100 shadow-sm rounded-xxl border-0 p-3 mb-2 position-relative"
    >
      {/* Заголовок и аватар в стиле PromiseView */}
      <div className="d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center">
          {/* Ранг перед аватаром */}
          <div className="me-2">
            {getRankIcon(leader.rank)}
          </div>
          
          <Link href={`/profile/${leader.telegram_id}`}>
            <img 
              src={leader.avatar_img_url || '/assets/images/defaultAvatar.png'} 
              alt="avatar" 
              width={32} 
              height={32} 
              className="rounded-circle me-2"
              style={{ objectFit: 'cover' }}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/assets/images/defaultAvatar.png';
              }}
            />
          </Link>
          <span className="text-dark font-xsss">{leader.display_name}</span>
        </div>
        
        {/* Карма */}
        <div className="d-flex align-items-center">
          <HeartHandshake className="text-primary me-1" size={20} />
          <span className="text-primary font-xss fw-bold">{leader.karma_points}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default LeaderCard; 