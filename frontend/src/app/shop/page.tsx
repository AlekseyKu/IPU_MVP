// // frontend/src/app/shop/page.tsx
'use client'

import { motion } from 'framer-motion'
import Header from '@/components/Header'
import Appfooter from '@/components/Appfooter'
import { useLanguage } from '@/context/LanguageContext'
import { useState } from 'react'

export default function Shop() {
  const { t } = useLanguage()
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const shopItems = [
    {
      id: 'boost',
      title: 'Boost',
      description: 'Подними обещание в общем списке',
      price: 200,
      icon: '🚀'
    },
    {
      id: 'premium',
      title: 'Premium',
      description: 'Ежемесячная подписка',
      price: 1000,
      icon: '⭐'
    },
    {
      id: 'donate',
      title: 'Donate',
      description: 'Поддержать проект',
      price: 500,
      icon: '💝'
    }
  ]

  const handlePurchase = async (itemId: string) => {
    setLoading(itemId)
    setError(null)

    try {
      // Запрос к нашему Next API (прокси)
      const res = await fetch('/api/shop/buy-product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ product: itemId })
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Не удалось создать покупку')
      }

      const data = await res.json()
      console.log('✅ Checkout URL:', data.checkoutUrl)

      // Проверяем, находимся ли мы в Telegram WebApp
      if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
        // Используем Telegram WebApp API для открытия платежа внутри приложения
        window.Telegram.WebApp.openInvoice(data.checkoutUrl, async (status: string) => {
          console.log('openInvoice status:', status)
          if (status === 'paid') {
            console.log('✅ Payment successful!')
            // Здесь можно добавить логику после успешной оплаты
          } else if (status === 'cancelled') {
            setError('Платеж был отменен')
          } else {
            setError(`Статус платежа: ${status}`)
          }
        })
      } else {
        // Fallback для браузера - открываем в новой вкладке
        window.open(data.checkoutUrl, '_blank')
      }

    } catch (e: any) {
      console.error('❌ Ошибка покупки:', e)
      setError(e.message || 'Ошибка при создании платежа')
    } finally {
      setLoading(null)
    }
  }

  return (
    <>
      <Header />
      <div style={{ marginTop: '100px', paddingBottom: '100px' }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-6">
              {/* Logo and Title */}
              <div className="text-center mb-4">
                <h2 className="fw-bold mb-0">Магазин IPU</h2>
              </div>

              {/* Shop Items */}
              <div className="d-flex flex-column gap-4">
                {shopItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="card bg-white border-0 shadow-sm rounded-3"
                    style={{ borderRadius: '12px' }}
                  >
                    <div className="card-body p-4">
                      <div className="d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center">
                          <div 
                            className="me-3 d-flex align-items-center justify-content-center"
                            style={{ 
                              width: '48px', 
                              height: '48px', 
                              borderRadius: '12px',
                              backgroundColor: '#f8f9fa',
                              fontSize: '24px'
                            }}
                          >
                            {item.icon}
                          </div>
                          <div>
                            <h5 className="fw-bold mb-1">{item.title}</h5>
                            <p className="text-muted mb-0 small">{item.description}</p>
                          </div>
                        </div>
                        <div className="text-end">
                          <div className="fw-bold text-primary mb-1">{item.price} ⭐</div>
                          <button
                            onClick={() => handlePurchase(item.id)}
                            disabled={loading === item.id}
                            className="btn btn-primary btn-sm"
                            style={{ 
                              borderRadius: '8px',
                              fontSize: '14px',
                              padding: '6px 16px'
                            }}
                          >
                            {loading === item.id ? 'Загрузка...' : 'Купить'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {error && (
                <div className="alert alert-danger mt-4 mb-0" role="alert">
                  {error}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Appfooter />
    </>
  )
}