// frontend\src\components\Appfooter.tsx
'use client'

import Link from 'next/link'
import React from 'react'

const Appfooter: React.FC = () => {
  return (
    <div className="app-footer border-0 shadow-lg bg-primary-gradiant">
      <Link href="/home" className="nav-content-bttn nav-center">
        <i className="feather-home"></i>
      </Link>
      <Link href="/defaultvideo" className="nav-content-bttn">
        <i className="feather-package"></i>
      </Link>
      <Link href="/defaultlive" className="nav-content-bttn" data-tab="chats">
        <i className="feather-layout"></i>
      </Link>
      <Link href="/shop2" className="nav-content-bttn">
        <i className="feather-layers"></i>
      </Link>
      <Link href="/defaultsettings" className="nav-content-bttn">
        <img
          src="/assets/images/user.png"
          alt="user"
          className="w30 shadow-xss rounded-pill"
        />
      </Link>
    </div>
  )
}

export default Appfooter
