// frontend/src/app/leaders/page.tsx
'use client'

import { motion } from 'framer-motion'
import { Trophy } from 'lucide-react'
import Header from '@/components/Header'
import Appfooter from '@/components/Appfooter'
import LeaderCard from '@/components/LeaderCard'
import { useLeaders, PeriodType } from '@/hooks/useLeaders'

export default function Leaders() {
  const { leaders, isLoading, error, period, changePeriod } = useLeaders();

  const getPeriodLabel = (period: PeriodType) => {
    switch (period) {
      case 'day': return 'День';
      case 'week': return 'Неделя';
      case 'all': return 'За все время';
      default: return 'За все время';
    }
  };

  const getActiveButtonClass = (buttonPeriod: PeriodType) => {
    return period === buttonPeriod 
      ? 'btn-primary' 
      : 'btn-outline-primary';
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 pt-10">
        <div className="container mx-auto px-4 max-w-2xl">
          {/* Заголовок */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-2"
          >
            <div className="flex items-center justify-center space-x-3 mb-3">
              <Trophy className="text-secondary" size={24} />
              <h1 className="font-md text-gray-600 my-3">Топ-30 пользователей</h1>
            </div>
            {/* <p className="text-gray-600">
              {getPeriodLabel(period)}
            </p> */}
          </motion.div>

          {/* Кнопки фильтров */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex justify-center mb-4"
          >
            <div className="d-flex w-100" style={{ gap: '8px' }}>
              <button
                onClick={() => changePeriod('day')}
                disabled={isLoading}
                className={`btn ${getActiveButtonClass('day')}`}
                style={{ flex: 1 }}
              >
                День
              </button>
              <button
                onClick={() => changePeriod('week')}
                disabled={isLoading}
                className={`btn ${getActiveButtonClass('week')}`}
                style={{ flex: 1 }}
              >
                Неделя
              </button>
              <button
                onClick={() => changePeriod('all')}
                disabled={isLoading}
                className={`btn ${getActiveButtonClass('all')}`}
                style={{ flex: 2 }}
              >
                За все время
              </button>
            </div>
          </motion.div>

          {/* Список лидеров с скроллом */}
          <div className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 300px)' }}>
            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-red-50 border border-red-200 rounded-lg p-4 text-center"
              >
                <p className="text-red-600">Ошибка загрузки: {error}</p>
                <button
                  onClick={() => changePeriod(period)}
                  className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Попробовать снова
                </button>
              </motion.div>
            )}

            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-center py-12"
              >
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                  <span className="text-gray-600">Загрузка лидеров...</span>
                </div>
              </motion.div>
            )}

            {leaders.length === 0 && !isLoading && !error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <Trophy className="mx-auto text-gray" size={24} />
                <p className="text-gray-600 mt-4">Пока нет лидеров</p>
              </motion.div>
            )}

            {leaders.map((leader, index) => (
              <LeaderCard key={leader.telegram_id} leader={leader} index={index} />
            ))}
          </div>
        </div>
      </div>
      <Appfooter />
    </>
  )
}