'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import DarkMode from './Darkbtn'

const Header: React.FC = () => {
  const [uiState, setUiState] = useState({
    isOpen: false,
    isActive: false,
    isNoti: false,
  })

  const toggleState = (key: keyof typeof uiState) => {
    setUiState((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const navClass = uiState.isOpen ? 'nav-active' : ''
  const buttonClass = uiState.isOpen ? 'active' : ''
  const searchClass = uiState.isActive ? 'show' : ''
  const notiClass = uiState.isNoti ? 'show' : ''

  return (
    <div className="nav-header bg-white shadow-xs border-0">
      <div className="nav-top">
        <Link href="/" className="d-flex align-items-center">
          <i className="feather-zap text-success display2-size me-3 ms-0"></i>
          <span className="d-inline-block fredoka-font ls-3 fw-600 text-current font-xxl logo-text mb-0">
            Sociala.
          </span>
        </Link>
        <Link href="/defaultmessage" className="mob-menu ms-auto me-2 chat-active-btn">
          <i className="feather-message-circle text-grey-900 font-sm btn-round-md bg-greylight"></i>
        </Link>
        <Link href="/defaultvideo" className="mob-menu me-2">
          <i className="feather-video text-grey-900 font-sm btn-round-md bg-greylight"></i>
        </Link>
        <span onClick={() => toggleState('isActive')} className="me-2 menu-search-icon mob-menu">
          <i className="feather-search text-grey-900 font-sm btn-round-md bg-greylight"></i>
        </span>
        <button onClick={() => toggleState('isOpen')} className={`nav-menu me-0 ms-2 ${buttonClass}`}></button>
      </div>

      <form className="float-left header-search ms-3">
        <div className="form-group mb-0 icon-input">
          <i className="feather-search font-sm text-grey-400"></i>
          <input
            type="text"
            placeholder="Start typing to search.."
            className="bg-grey border-0 lh-32 pt-2 pb-2 ps-5 pe-3 font-xssss fw-500 rounded-xl w350 theme-dark-bg"
          />
        </div>
      </form>

      {/* Navigation Icons */}
      {[
        ['/', 'home'],
        ['/defaultstorie', 'zap'],
        ['/defaultvideo', 'video'],
        ['/defaultgroup', 'user'],
        ['/shop2', 'shopping-bag'],
      ].map(([href, icon], i) => (
        <Link key={i} href={href} className="p-2 text-center ms-3 menu-icon center-menu-icon">
          <i className={`feather-${icon} font-lg bg-greylight btn-round-lg theme-dark-bg text-grey-500`}></i>
        </Link>
      ))}

      <span className={`p-2 pointer text-center ms-auto menu-icon ${notiClass}`} onClick={() => toggleState('isNoti')}>
        <span className="dot-count bg-warning"></span>
        <i className="feather-bell font-xl text-current"></i>
      </span>

      <div className={`dropdown-menu p-4 right-0 rounded-xxl border-0 shadow-lg ${notiClass}`}>
        <h4 className="fw-700 font-xss mb-4">Notification</h4>
        {[1, 2, 3, 4].map((_, idx) => (
          <div key={idx} className="card bg-transparent-card w-100 border-0 ps-5 mb-3">
            <img src="/assets/images/user.png" alt="user" className="w40 position-absolute left-0 rounded-pill" />
            <h5 className="font-xsss text-grey-900 mb-1 mt-0 fw-700 d-block">
              User {idx + 1}{' '}
              <span className="text-grey-400 font-xsssss fw-600 float-right mt-1">{idx + 1} min</span>
            </h5>
            <h6 className="text-grey-500 fw-500 font-xssss lh-4">This is a notification message.</h6>
          </div>
        ))}
      </div>

      <Link href="/defaultmessage" className="p-2 text-center ms-3 menu-icon chat-active-btn">
        <i className="feather-message-square font-xl text-current"></i>
      </Link>
      <DarkMode />
      <Link href="/defaultsettings" className="p-0 ms-3 menu-icon">
        <img src="/assets/images/user.png" alt="user" className="w40 mt--1 rounded-pill" />
      </Link>

      <nav className={`navigation scroll-bar ${navClass}`}>
        <div className="container ps-0 pe-0">
          <div className="nav-content">
            <div className="nav-wrap bg-white bg-transparent-card rounded-xxl shadow-xss pt-3 pb-1 mb-2 mt-2">
              <div className="nav-caption fw-600 font-xssss text-grey-500">
                <span>New </span>Feeds
              </div>
              <ul className="mb-1 top-content">
                <li>
                  <Link href="/home" className="nav-content-bttn open-font">
                    <i className="feather-tv btn-round-md bg-blue-gradiant me-3"></i>
                    <span>Newsfeed</span>
                  </Link>
                </li>
                <li>
                  <Link href="/defaultbadge" className="nav-content-bttn open-font">
                    <i className="feather-award btn-round-md bg-red-gradiant me-3"></i>
                    <span>Badges</span>
                  </Link>
                </li>
                <li>
                  <Link href="/defaultstorie" className="nav-content-bttn open-font">
                    <i className="feather-globe btn-round-md bg-gold-gradiant me-3"></i>
                    <span>Explore Stories</span>
                  </Link>
                </li>
                <li>
                  <Link href="/defaultgroup" className="nav-content-bttn open-font">
                    <i className="feather-zap btn-round-md bg-mini-gradiant me-3"></i>
                    <span>Popular Groups</span>
                  </Link>
                </li>
                <li>
                  <Link href="/userpage" className="nav-content-bttn open-font">
                    <i className="feather-user btn-round-md bg-primary-gradiant me-3"></i>
                    <span>Author Profile</span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* More Pages */}
            <div className="nav-wrap bg-white bg-transparent-card rounded-xxl shadow-xss pt-3 pb-1 mb-2">
              <div className="nav-caption fw-600 font-xssss text-grey-500">
                <span>More </span>Pages
              </div>
              <ul className="mb-3">
                <li>
                  <Link href="/defaultemailbox" className="nav-content-bttn open-font">
                    <i className="font-xl text-current feather-inbox me-3"></i>
                    <span>Email Box</span>
                    <span className="circle-count bg-warning mt-1">584</span>
                  </Link>
                </li>
                <li>
                  <Link href="/defaulthotel" className="nav-content-bttn open-font">
                    <i className="font-xl text-current feather-home me-3"></i>
                    <span>Near Hotel</span>
                  </Link>
                </li>
                <li>
                  <Link href="/defaultevent" className="nav-content-bttn open-font">
                    <i className="font-xl text-current feather-map-pin me-3"></i>
                    <span>Latest Event</span>
                  </Link>
                </li>
                <li>
                  <Link href="/defaultlive" className="nav-content-bttn open-font">
                    <i className="font-xl text-current feather-youtube me-3"></i>
                    <span>Live Stream</span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Account */}
            <div className="nav-wrap bg-white bg-transparent-card rounded-xxl shadow-xss pt-3 pb-1">
              <div className="nav-caption fw-600 font-xssss text-grey-500">Account</div>
              <ul className="mb-1">
                <li>
                  <Link href="/defaultsettings" className="nav-content-bttn open-font h-auto pt-2 pb-2">
                    <i className="font-sm feather-settings me-3 text-grey-500"></i>
                    <span>Settings</span>
                  </Link>
                </li>
                <li>
                  <Link href="/defaultanalytics" className="nav-content-bttn open-font h-auto pt-2 pb-2">
                    <i className="font-sm feather-pie-chart me-3 text-grey-500"></i>
                    <span>Analytics</span>
                  </Link>
                </li>
                <li>
                  <Link href="/defaultmessage" className="nav-content-bttn open-font h-auto pt-2 pb-2">
                    <i className="font-sm feather-message-square me-3 text-grey-500"></i>
                    <span>Chat</span>
                    <span className="circle-count bg-warning mt-0">23</span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>

      {/* Search Overlay */}
      <div className={`app-header-search ${searchClass}`}>
        <form className="search-form">
          <div className="form-group searchbox mb-0 border-0 p-1">
            <input type="text" className="form-control border-0" placeholder="Search..." />
            <span className="ms-1 mt-1 d-inline-block close searchbox-close">
              <i className="ti-close font-xs" onClick={() => toggleState('isActive')}></i>
            </span>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Header
