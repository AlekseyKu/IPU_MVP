//frontend\src\components\Appfooter.tsx
'use client'

import React from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useUser, useCreatePostModal } from '@/context/UserContext'
import { Home, House, User, CirclePlus, BarChart2, List, ShoppingCart } from 'lucide-react'

const Appfooter: React.FC = () => {
  const pathname = usePathname()
  const router = useRouter()
  const { telegramId } = useUser()
  const { setIsCreatePostOpen } = useCreatePostModal()

  const links = [
    {
      icon: User,
      getHref: () => (telegramId ? `/user/${telegramId}` : '/'),
      onClick: () => router.push(telegramId ? `/user/${telegramId}` : '/')
    },
    {
      icon: House,
      getHref: () => '/list',
      onClick: () => router.push('/list')
    },
    {
      icon: CirclePlus,
      getHref: () => '#',
      onClick: () => setIsCreatePostOpen(true)
    },
    {
      icon: BarChart2,
      getHref: () => '/leaders',
      onClick: () => router.push('/leaders')
    },
    {
      icon: ShoppingCart,
      getHref: () => '/shop',
      onClick: () => router.push('/shop')
    },
  ]

  return (
    <div className="app-footer border-0 shadow-lg bg-white d-flex justify-content-around align-items-center py-3">
      {links.map(({ icon: Icon, getHref, onClick }, idx) => {
        const href = getHref()
        const isActive = pathname === href

        return (
          <button
            key={idx}
            onClick={(e) => { e.preventDefault(); onClick() }}
            className="nav-content-bttn nav-center bg-transparent border-0 p-0"
          >
            <Icon
              style={{ color: isActive ? '#0066ff' : '#A0AEC0' }}
              className="w-6 h-6"
            />
          </button>
        )
      })}
    </div>
  )
}

export default Appfooter
