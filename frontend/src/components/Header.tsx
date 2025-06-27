// frontend\src\components\Header.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Video,
  Search,
  Home,
  Zap,
  User,
  ShoppingBag,
  Bell,
  Settings,
  MessageSquare,
  List,
  ShoppingCart,
  PlusCircle,
  BarChart2,
  Newspaper,
  Send,
  ExternalLink,
  X,
} from 'lucide-react';

const Header: React.FC = () => {
  const [uiState, setUiState] = useState({
    isOpen: false,
    isActive: false,
    isNoti: false,
  });

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const toggleState = (key: keyof typeof uiState) => {
    setUiState((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  if (!isMounted) return null;

  return (
    <div className="bg-white shadow-sm border-none">
      <div className="flex justify-between items-center px-4 sm:px-6 lg:px-8">
        {/* Лого слева */}
        <Link href="/" className="flex items-center">
          <Image
            src="/assets/images/IPU/logo.png"
            alt="IPU Logo"
            width={157}
            height={50}
            className="mr-3"
          />
        </Link>

        {/* Кнопки справа */}
        <div className="flex items-center">
          <span onClick={() => toggleState('isActive')} className="mr-2 cursor-pointer">
            <Search className="w-5 h-5 text-gray-900 bg-gray-100 p-1 rounded-full" />
          </span>
          <button
            onClick={() => toggleState('isOpen')}
            className={`w-8 h-8 flex items-center justify-center ${uiState.isOpen ? 'bg-gray-200' : ''}`}
          >
            <List className="w-6 h-6 text-gray-900" />
          </button>
        </div>
      </div>

      <form className="ml-3">
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute top-3 left-3" />
          <input
            type="text"
            placeholder="Start typing to search.."
            className="bg-gray-100 border-none h-10 pl-10 pr-3 font-sans text-sm font-medium rounded-xl w-[350px] focus:outline-none"
          />
        </div>
      </form>

      {[
        { href: '/', icon: Home },
        { href: '/defaultstorie', icon: Zap },
        { href: '/defaultvideo', icon: Video },
        { href: '/defaultgroup', icon: User },
        { href: '/shop2', icon: ShoppingBag },
      ].map(({ href, icon: Icon }, i) => (
        <Link key={i} href={href} className="p-2 text-center ml-3">
          <Icon className="w-5 h-5 text-gray-500 bg-gray-100 rounded-full p-1" />
        </Link>
      ))}

      <span
        className={`p-2 cursor-pointer text-center ml-auto relative ${uiState.isNoti ? 'block' : 'hidden'}`}
        onClick={() => toggleState('isNoti')}
      >
        <span className="absolute top-0 right-0 w-2 h-2 bg-yellow-500 rounded-full"></span>
        <Bell className="w-6 h-6 text-gray-700" />
      </span>

      <div
        className={`absolute right-0 p-4 bg-white rounded-2xl border-none shadow-lg ${uiState.isNoti ? 'block' : 'hidden'}`}
      >
        <h4 className="font-bold text-sm mb-4">Notification</h4>
        {[1, 2, 3, 4].map((_, idx) => (
          <div key={idx} className="flex w-full border-none pl-5 mb-3">
            <Image
              src="/assets/images/user.png"
              alt="user"
              width={40}
              height={40}
              className="absolute left-0 rounded-full"
            />
            <div>
              <h5 className="text-sm text-gray-900 mb-1 font-bold flex justify-between">
                User {idx + 1}
                <span className="text-gray-400 text-xs font-semibold">{idx + 1} min</span>
              </h5>
              <h6 className="text-gray-500 text-xs font-medium leading-tight">
                This is a notification message.
              </h6>
            </div>
          </div>
        ))}
      </div>

      <Link href="/defaultmessage" className="p-2 text-center ml-3">
        <MessageSquare className="w-6 h-6 text-gray-700" />
      </Link>

      <Link href="/defaultsettings" className="ml-3">
        <Image
          src="/assets/images/user.png"
          alt="user"
          width={40}
          height={40}
          className="rounded-full"
        />
      </Link>

      {/* nav menu */}
      <nav
        className={`fixed top-0 left-0 h-full bg-white overflow-y-auto ${uiState.isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300`}
      >
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-sm pt-3 pb-1 mb-2 mt-2">
            <div className="text-gray-500 font-semibold text-xs mb-1">МЕНЮ</div>
            <ul className="mb-1">
              <li>
                <Link href="/" className="flex items-center text-sm font-medium py-2">
                  <User className="mr-3 w-4 h-4" />
                  <span>Моя страница</span>
                </Link>
              </li>
              <li>
                <Link href="/home" className="flex items-center text-sm font-medium py-2">
                  <List className="mr-3 w-4 h-4" />
                  <span>Лента обещаний</span>
                </Link>
              </li>
              <li>
                <Link href="/defaultstorie" className="flex items-center text-sm font-medium py-2">
                  <PlusCircle className="mr-3 w-4 h-4" />
                  <span>Создать обещание</span>
                </Link>
              </li>
              <li>
                <Link href="/defaultgroup" className="flex items-center text-sm font-medium py-2">
                  <BarChart2 className="mr-3 w-4 h-4" />
                  <span>Таблица лидеров</span>
                </Link>
              </li>
              <li>
                <Link href="/userpage" className="flex items-center text-sm font-medium py-2">
                  <ShoppingCart className="mr-3 w-4 h-4" />
                  <span>Маркетплейс IPU</span>
                </Link>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl shadow-sm pt-3 pb-1 mb-2">
            <div className="text-gray-500 font-semibold text-xs mb-1">Ресурсы IPU</div>
            <ul className="mb-3">
              <li>
                <Link
                  href="https://dexstudioapp.site/projects/ipu"
                  target="_blank"
                  className="flex items-center text-sm font-medium py-2"
                >
                  <ExternalLink className="mr-3 w-5 h-5" />
                  <span>Наш сайт</span>
                </Link>
              </li>
              <li>
                <Link href="/defaulthotel" className="flex items-center text-sm font-medium py-2">
                  <Send className="mr-3 w-5 h-5" />
                  <span>Мы в Telegram</span>
                </Link>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl shadow-sm pt-3 pb-1">
            <div className="text-gray-500 font-semibold text-xs mb-1">Аккаунт</div>
            <ul className="mb-1">
              <li>
                <Link href="/defaultsettings" className="flex items-center text-sm font-medium py-2">
                  <Settings className="mr-3 w-4 h-4 text-gray-500" />
                  <span>Настройки</span>
                </Link>
              </li>
              <li>
                <Link href="/defaultmessage" className="flex items-center text-sm font-medium py-2">
                  <MessageSquare className="mr-3 w-4 h-4 text-gray-500" />
                  <span>Чат</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Search bar overlay */}
      <div
        className={`fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center ${uiState.isActive ? 'block' : 'hidden'}`}
      >
        <form className="w-full max-w-md p-1">
          <div className="relative">
            <input
              type="text"
              className="w-full border-none rounded-md p-2 focus:outline-none"
              placeholder="Search..."
            />
            <span className="absolute right-2 top-2 cursor-pointer">
              <X className="w-4 h-4" onClick={() => toggleState('isActive')} />
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Header;