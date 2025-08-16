// frontend\src\components\Header.tsx
'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useUser } from '@/context/UserContext';
import { useUserData } from '@/hooks/useUserData';
import { useLanguage } from '@/context/LanguageContext';
import PrivacyModal from './PrivacyModal';
import TermsModal from './TermsModal';
import FaqModal from './FaqModal';
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
  Linkedin,
  Instagram,
  Youtube,
  HelpCircle,
  MessageCircle,
  FileText,
  Shield,
  X,
} from 'lucide-react'
import UserSearch from './UserSearch';
import LanguageSwitcher from './LanguageSwitcher';

const Header: React.FC = () => {
  const { t } = useLanguage(); // "Инициализация перевода"
  const [uiState, setUiState] = useState({
    isOpen: false,
    isActive: false,
    isNoti: false,
  })
  const [showPrivacyModal, setShowPrivacyModal] = useState(false)
  const [showTermsModal, setShowTermsModal] = useState(false)
  const [showFaqModal, setShowFaqModal] = useState(false)

  const { telegramId } = useUser();
  const { userData } = useUserData({ telegramId: telegramId || 0 });

  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const toggleState = (key: keyof typeof uiState) => {
    setUiState((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  // Обработчик клика вне меню
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setUiState((prev) => ({ ...prev, isOpen: false }))
    }
  }

  // Обработчик открытия политики конфиденциальности
  const handlePrivacyClick = (e: React.MouseEvent) => {
    e.preventDefault()
    setShowPrivacyModal(true)
  }

  // Обработчик открытия условий использования
  const handleTermsClick = (e: React.MouseEvent) => {
    e.preventDefault()
    setShowTermsModal(true)
  }

  // Обработчик открытия FAQ
  const handleFaqClick = (e: React.MouseEvent) => {
    e.preventDefault()
    setShowFaqModal(true)
  }



  if (!isMounted) return null

  return (
    <div className="nav-header bg-white shadow-xs border-0">
      <div className="nav-top d-flex justify-content-between align-items-center px-0">
        {/* Лого слева */}
        <Link href="/" className="d-flex align-items-center">
          <Image
            src="/assets/images/ipu/logo.png"
            alt="Logo"
            width={157}
            height={50}
            className="me-3"
            priority
          />
        </Link>

        {/* Кнопки справа */}
        <div className="d-flex align-items-center">
          <span onClick={() => toggleState('isActive')} className="me-2 cursor-pointer">
            <Search className="w-5 h-5 text-grey-900 bg-greylight p-1 rounded-full btn-round-sm" />
          </span>
          <button
            onClick={() => toggleState('isOpen')}
            className={`nav-menu ms-2 ${uiState.isOpen ? 'active' : ''}`}
          ></button>
        </div>
      </div>


      {/* <form className="float-left header-search ms-3">
        <div className="form-group mb-0 icon-input">
          <Search className="w-4 h-4 text-grey-400 absolute top-3 left-3" />
          <input
            type="text"
            placeholder="Start typing to search.."
            className="bg-grey border-0 lh-32 pt-2 pb-2 ps-5 pe-3 font-xssss fw-500 rounded-xl w350 theme-dark-bg"
          />
        </div>
      </form> */}

      {/* {[
        { href: '/', icon: Home },
        { href: '/defaultstorie', icon: Zap },
        { href: '/defaultvideo', icon: Video },
        { href: '/defaultgroup', icon: User },
        { href: '/shop2', icon: ShoppingBag },
      ].map(({ href, icon: Icon }, i) => (
        <Link key={i} href={href} className="p-2 text-center ms-3 menu-icon center-menu-icon">
          <Icon className="w-5 h-5 text-grey-500 bg-greylight rounded-full p-1" />
        </Link>
      ))} */}

      <span className={`p-2 pointer text-center ms-auto menu-icon ${uiState.isNoti ? 'show' : ''}`} onClick={() => toggleState('isNoti')}>
        <span className="dot-count bg-warning"></span>
        <Bell className="w-6 h-6 text-current" />
      </span>

      <div className={`dropdown-menu p-4 right-0 rounded-xxl border-0 shadow-lg ${uiState.isNoti ? 'show' : ''}`}>
        <h4 className="fw-700 font-xss mb-4">{t('header.notifications')}</h4> {/* "Уведомления" */}
        {[1, 2, 3, 4].map((_, idx) => (
          <div key={idx} className="card bg-transparent-card w-100 border-0 ps-5 mb-3">
            <Image src="/assets/images/user.png" alt="user" width={40} height={40} className="position-absolute left-0 rounded-pill" />
            <h5 className="font-xsss text-grey-900 mb-1 mt-0 fw-700 d-block">
              {t('header.user')} {idx + 1} {/* "Пользователь" */}
              <span className="text-grey-400 font-xsssss fw-600 float-right mt-1">{idx + 1} {t('header.min')}</span> {/* "мин" */}
            </h5>
            <h6 className="text-grey-500 fw-500 font-xssss lh-4">{t('header.notificationMessage')}</h6> {/* "Это сообщение уведомления." */}
          </div>
        ))}
      </div>

      <Link href="/defaultmessage" className="p-2 text-center ms-3 menu-icon chat-active-btn">
        <MessageSquare className="w-6 h-6 text-current" />
      </Link>

      <Link href="/defaultsettings" className="p-0 ms-3 menu-icon">
        <Image src="/assets/images/user.png" alt="user" width={40} height={40} className="rounded-pill" />
      </Link>

      {/* nav menu */}
      <nav className={`navigation scroll-bar ${uiState.isOpen ? 'nav-active' : ''}`} style={{ width: '320px' }}>
        <div className="container ps-0 pe-0 pt-4">
          {/* Language Switcher в верхней части меню */}
          <div>
            <LanguageSwitcher />
          </div>
          <div className="nav-content ">

            <div className="nav-wrap bg-white bg-transparent-card rounded-xxl shadow-xss pt-2">
              <div className="nav-caption fw-600 font-xsss text-primary">
                {t('header.resources')} IPU {/* "Ресурсы IPU" */}
              </div>
              <ul className="mb-3">
                <li>
                  <Link href="https://dexsa.site/projects/ipu" target="_blank" className="nav-content-bttn open-font">
                    <ExternalLink className="me-2" style={{ width: '20px', height: '20px' }} />
                    <span className="font-xsss">{t('menu.website')}</span> {/* "Наш сайт" */}
                  </Link>
                </li>
                <li>
                  <Link href="https://t.me/IPU_community" target="_blank" className="nav-content-bttn open-font">
                    <Send className="me-2" style={{ width: '20px', height: '20px' }} />
                    <span className="font-xsss">{t('menu.telegram')}</span> {/* "Telegram" */}
                  </Link>
                </li>
                <li>
                  <Link href="https://www.linkedin.com/company/dexstudioapp/?viewAsMember=true" target="_blank" className="nav-content-bttn open-font">
                    <Linkedin className="me-2" style={{ width: '20px', height: '20px' }} />
                    <span className="font-xsss">{t('menu.linkedin')}</span> {/* "LinkedIn" */}
                  </Link>
                </li>
                <li>
                  <Link href="https://www.instagram.com/dexstudioapp" target="_blank" className="nav-content-bttn open-font">
                    <Instagram className="me-2" style={{ width: '20px', height: '20px' }} />
                    <span className="font-xsss">{t('menu.instagram')}</span> {/* "Instagram" */}
                  </Link>
                </li>
                <li>
                  <Link href="https://www.youtube.com/@dexstudioapp" target="_blank" className="nav-content-bttn open-font">
                    <Youtube className="me-2" style={{ width: '20px', height: '20px' }} />
                    <span className="font-xsss">{t('menu.youtube')}</span> {/* "Youtube" */}
                  </Link>
                </li>
              </ul>
            </div>

            <div className="nav-wrap bg-white bg-transparent-card rounded-xxl shadow-xss pt-2">
              <div className="nav-caption fw-600 font-xsss text-primary">{t('header.account')}</div> {/* "Аккаунт" */}
              <ul className="mb-3">
                <li>
                  <Link href={userData?.telegram_id ? `/settings/${userData.telegram_id}` : '/'} className="nav-content-bttn open-font">
                    <Settings className="me-2" style={{ width: '20px', height: '20px' }} />
                    <span className="font-xsss">{t('menu.settings')}</span> {/* "Настройки" */}
                  </Link>
                </li>
                <li>
                  <a href="#" onClick={handleFaqClick} className="nav-content-bttn open-font">
                    <HelpCircle className="me-2" style={{ width: '20px', height: '20px' }} />
                    <span className="font-xsss">{t('menu.faq')}</span> {/* "Вопросы и ответы" */}
                  </a>
                </li>
                <li>
                  <Link href="https://t.me/dexstudioapp" target="_blank" className="nav-content-bttn open-font">
                    <MessageCircle className="me-2" style={{ width: '20px', height: '20px' }} />
                    <span className="font-xsss">{t('menu.support')}</span> {/* "Поддержка" */}
                  </Link>
                </li>
              </ul>
            </div>

            <div className="nav-wrap bg-white bg-transparent-card rounded-xxl shadow-xss pt-2">
              <div className="nav-caption fw-600 font-xsss text-primary">{t('menu.legal')}</div> {/* "Правовая информация" */}
              <ul className="mb-1">
                <li>
                  <a href="#" onClick={handlePrivacyClick} className="nav-content-bttn open-font">
                    {/* <Shield className="me-2" style={{ width: '20px', height: '20px' }} /> */}
                    <span className="font-xsss">{t('menu.privacyPolicy')}</span> {/* "Политика конфиденциальности" */}
                  </a>
                </li>
                <li>
                  <a href="#" onClick={handleTermsClick} className="nav-content-bttn open-font">
                    {/* <FileText className="me-2" style={{ width: '20px', height: '20px' }} /> */}
                    <span className="font-xsss">{t('menu.termsOfUse')}</span> {/* "Условия использования" */}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>

      {/* Overlay для закрытия меню по клику вне его */}
      {uiState.isOpen && (
        <div
          className="nav-overlay"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.3)',
            zIndex: 999,
          }}
          onClick={handleOverlayClick}
        />
      )}

      {/* Search bar overlay */}
      {uiState.isActive && (
        <div
          className="app-header-search-overlay"
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.3)', zIndex: 9997 }}
          onClick={() => toggleState('isActive')}
        />
      )}
      <div className={`app-header-search ${uiState.isActive ? 'show' : ''}` } style={{ zIndex: 9998 }}>
        <form className="search-form">
          <div className="form-group searchbox mb-0 border-0 p-1">
            <UserSearch myTelegramId={typeof userData?.telegram_id === 'number' ? userData.telegram_id : undefined} />
            <span className="ms-1 mt-1 d-inline-block close searchbox-close cursor-pointer">
              <X className="w-4 h-4 me-2 mb-2" onClick={() => toggleState('isActive')} />
            </span>
          </div>
        </form>
      </div>

      {/* Модальное окно политики конфиденциальности */}
      {showPrivacyModal && (
        <PrivacyModal onClose={() => setShowPrivacyModal(false)} />
      )}

      {/* Модальное окно условий использования */}
      {showTermsModal && (
        <TermsModal onClose={() => setShowTermsModal(false)} />
      )}

      {/* Модальное окно FAQ */}
      {showFaqModal && (
        <FaqModal onClose={() => setShowFaqModal(false)} />
      )}
    </div>
  )
}

export default Header
