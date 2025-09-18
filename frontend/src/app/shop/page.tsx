// frontend/src/app/shop/page.tsx
'use client'

import Header from '@/components/Header'
import Appfooter from '@/components/Appfooter'

export default function Shop() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 пшеpt-10">
        <div className="container mx-auto px-3 max-w-2xl">
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">Магазин находится в разработке</p>
          </div>
        </div>
      </div>
      <Appfooter />
    </>
  )
}
