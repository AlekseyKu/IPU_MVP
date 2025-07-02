// frontend/src/components/Appfooter.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useUser } from '@/context/UserContext';
import {
  Home,
  User,
  CirclePlus,
  BarChart2,
  List,
  ShoppingCart
} from 'lucide-react'

const Appfooter: React.FC = () => {
  const pathname = usePathname()
  const { telegramId } = useUser();

  const links = [
    { href: telegramId ? `/user/${telegramId}` : '/', icon: User },
    { href: '/list', icon: List },
    { href: '/create', icon: CirclePlus },
    { href: '/leaders', icon: BarChart2 },
    { href: '/shop', icon: ShoppingCart },
  ]

  return (
    <div className="app-footer border-0 shadow-lg bg-white d-flex justify-content-around align-items-center py-3">
      {links.map(({ href, icon: Icon }, idx) => {
        const isActive = pathname === href

        return (
          <Link key={idx} href={href} className="nav-content-bttn nav-center">
            <Icon
              style={{ color: isActive ? '#0066ff' : '#A0AEC0' }}
              className="w-6 h-6"
            />
          </Link>
        )
      })}
    </div>
  )
}

export default Appfooter