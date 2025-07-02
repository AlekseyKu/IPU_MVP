// frontend/src/app/leaders/page.tsx
'use client'

import { motion } from 'framer-motion'
import Header from '@/components/Header'
import Appfooter from '@/components/Appfooter'

export default function Leaders() {
  return (
    <>
      <Header />
      <div style={{ marginTop: '100px', minHeight: 'calc(100vh - 200px)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="fw-400 font-xs" style={{ textAlign: 'center' }}>Таблица лидеров <br/> в разработке</h2>
        </motion.div>
      </div>
      <Appfooter />
    </>
  )
}