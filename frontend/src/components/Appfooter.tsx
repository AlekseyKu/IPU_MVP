// frontend\src\components\Appfooter.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  User,
  CirclePlus,
  BarChart2,
  List,
  ShoppingCart,
} from 'lucide-react';

const Appfooter: React.FC = () => {
  const pathname = usePathname();

  const links = [
    { href: '/', icon: User },
    { href: '/list', icon: List },
    { href: '/create', icon: CirclePlus },
    { href: '/leaders', icon: BarChart2 },
    { href: '/shop', icon: ShoppingCart },
  ];

  return (
    <div className="border-0 shadow-lg bg-white flex justify-around items-center py-2">
      {links.map(({ href, icon: Icon }, idx) => {
        const isActive = pathname === href;

        return (
          <Link key={idx} href={href} className="flex items-center justify-center">
            <Icon
              style={{ color: isActive ? '#0066ff' : '#A0AEC0' }}
              className="w-6 h-6"
            />
          </Link>
        );
      })}
    </div>
  );
};

export default Appfooter;