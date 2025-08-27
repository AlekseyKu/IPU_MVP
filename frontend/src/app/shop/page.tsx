// // frontend/src/app/shop/page.tsx
'use client'

import { motion } from 'framer-motion'
import Header from '@/components/Header'
import Appfooter from '@/components/Appfooter'
import { useLanguage } from '@/context/LanguageContext'
import { useEffect, useState } from 'react'

export default function Leaders() {
  const { t } = useLanguage()

  const [balance, setBalance] = useState(0)
  const [amount, setAmount] = useState(100)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchBalance = async () => {
    try {
      setError(null)
      const headers: Record<string, string> = {}
      const initData = typeof window !== 'undefined' && window.Telegram?.WebApp ? (window.Telegram.WebApp.initData || '') : ''
      headers['x-telegram-init-data'] = initData
      if (typeof window !== 'undefined' && window.Telegram?.WebApp?.initDataUnsafe?.user) {
        const user = window.Telegram.WebApp.initDataUnsafe.user
        headers['x-telegram-user-id'] = user.id.toString()
      }
      const res = await fetch('/api/balance', { headers })
      if (!res.ok) throw new Error('Failed to fetch balance')
      const data = await res.json()
      setBalance(data.balance)
    } catch (e: any) {
      setError(e.message || 'Failed to fetch balance')
    }
  }

  useEffect(() => {
    fetchBalance()
  }, [])

  const topUp = async () => {
    if (!amount || amount <= 0) {
      setError('Please enter a valid amount')
      return
    }
    setLoading(true)
    setError(null)
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' }
      const initData = typeof window !== 'undefined' && window.Telegram?.WebApp ? (window.Telegram.WebApp.initData || '') : ''
      headers['x-telegram-init-data'] = initData
      if (typeof window !== 'undefined' && window.Telegram?.WebApp?.initDataUnsafe?.user) {
        const user = window.Telegram.WebApp.initDataUnsafe.user
        headers['x-telegram-user-id'] = user.id.toString()
      }
      const res = await fetch('/api/payments/create', {
        method: 'POST',
        headers,
        body: JSON.stringify({ amount })
      })
      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || 'Failed to create payment')
      }
      const data = await res.json()

      const invoiceLink: string = data.invoice_link
      const isMockInvoice = typeof invoiceLink === 'string' && invoiceLink.includes('mock-invoice')

      if (isMockInvoice) {
        // Мок: пропускаем openInvoice, сразу дергаем webhook и обновляем баланс
        const webhookRes = await fetch('/api/payments/webhook', { method: 'POST' })
        if (!webhookRes.ok) {
          throw new Error('Mock webhook failed')
        }
        await fetchBalance()
        setError(null)
        setLoading(false)
        return
      }
      
      if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
        window.Telegram.WebApp.openInvoice(invoiceLink, async (status: string) => {
          console.log('openInvoice status:', status)
          if (status === 'paid') {
            await fetchBalance()
            setError(null)
          } else if (status === 'cancelled') {
            setError('Payment was cancelled')
          } else {
            setError(`Payment status: ${status}`)
          }
        })
      } else {
        throw new Error('This app must be opened in Telegram WebApp')
      }
    } catch (e: any) {
      setError(e.message || 'Failed to create payment')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Header />
      <div style={{ marginTop: '100px', minHeight: 'calc(100vh - 200px)' }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="card bg-white border-0 shadow-sm rounded-xxl mb-4"
              >
                <div className="card-body p-4">
                  <h4 className="fw-700 mb-2" style={{ textAlign: 'center' }}>{t('shop.title')}</h4>
                  <p className="text-grey-500 mb-4" style={{ textAlign: 'center' }}>{t('shop.inDevelopment')}</p>

                  <div className="border-top pt-4 mt-2"></div>

                  <h5 className="fw-600 mb-3" style={{ textAlign: 'center' }}>Balance</h5>
                  <div className="text-center mb-4">
                    <span className="fw-700 text-primary" style={{ fontSize: 24 }}>{balance} ⭐</span>
                  </div>

                  <div className="row g-3 align-items-end">
                    <div className="col-8">
                      <label className="form-label small text-grey-600">Amount (Stars)</label>
                      <input
                        type="number"
                        min={1}
                        max={10000}
                        className="form-control"
                        value={amount}
                        onChange={(e) => setAmount(Number(e.target.value))}
                        placeholder="Enter amount"
                      />
                      <div className="form-text">Min: 1 ⭐, Max: 10000 ⭐</div>
                    </div>
                    <div className="col-4 d-grid">
                      <button
                        onClick={topUp}
                        disabled={loading}
                        className="btn btn-primary"
                      >
                        {loading ? 'Processing...' : 'Top Up'}
                      </button>
                    </div>
                  </div>

                  {error && (
                    <div className="alert alert-danger mt-3 mb-0" role="alert">
                      {error}
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
      <Appfooter />
    </>
  )
}