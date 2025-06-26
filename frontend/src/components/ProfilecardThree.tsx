// frontend\src\components\ProfilecardThree.tsx
'use client'

import Link from 'next/link'
import React from 'react'

const ProfilecardThree: React.FC = () => {
  return (
    <div className="card w-100 border-0 p-0 bg-white shadow-xss rounded-xxl">
      <div className="card-body h250 p-0 rounded-xxl overflow-hidden m-3" style={{ height: '300px' }}>
        <img src="/assets/images/comingsoon.svg" alt="avater" />
      </div>

      <div className="card-body p-0 position-relative">
        <figure className="avatar position-absolute w100 z-index-1" style={{ top: '-40px', left: '30px' }}>
          <img
            src="/assets/images/user.png"
            alt="avater"
            className="float-right p-1 bg-white rounded-circle w-100"
          />
        </figure>
        <h4 className="fw-700 font-sm mt-2 mb-lg-5 mb-4 pl-15">
          Mohannad Zitoun
          <span className="fw-500 font-xssss text-grey-500 mt-1 mb-3 d-block">support@gmail.com</span>
        </h4>

        <div className="d-flex align-items-center justify-content-center position-absolute-md right-15 top-0 me-2">
          <Link
            href="/defaultmember"
            className="d-none d-lg-block bg-success p-3 z-index-1 rounded-3 text-white font-xsssss text-uppercase fw-700 ls-3"
          >
            Add Friend
          </Link>
          <Link
            href="/defaultemailbox"
            className="d-none d-lg-block bg-greylight btn-round-lg ms-2 rounded-3 text-grey-700"
          >
            <i className="feather-mail font-md"></i>
          </Link>
          <Link
            href="/home"
            className="d-none d-lg-block bg-greylight btn-round-lg ms-2 rounded-3 text-grey-700"
          >
            <i className="ti-more font-md tetx-dark"></i>
          </Link>

          {/* dropdown — можешь подключить как popover или оставить пустышкой */}
          <div className="dropdown-menu dropdown-menu-end p-4 rounded-xxl border-0 shadow-lg">
            {[ 
              ['bookmark', 'Save Link'],
              ['alert-circle', 'Hide Post'],
              ['alert-octagon', 'Hide all from Group'],
              ['lock', 'Unfollow Group']
            ].map(([icon, text], i) => (
              <div key={i} className="card-body p-0 d-flex mt-2">
                <i className={`feather-${icon} text-grey-500 me-3 font-lg`}></i>
                <h4 className="fw-600 text-grey-900 font-xssss mt-0 me-0">
                  {text}
                  <span className="d-block font-xsssss fw-500 mt-1 lh-3 text-grey-500">Save to your saved items</span>
                </h4>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card-body d-block w-100 shadow-none mb-0 p-0 border-top-xs">
        <ul className="nav nav-tabs h55 d-flex product-info-tab border-bottom-0 ps-4" id="pills-tab" role="tablist">
          {[
            ['navtabs1', 'About'],
            ['navtabs2', 'Membership'],
            ['navtabs3', 'Discussion'],
            ['navtabs4', 'Video'],
            ['navtabs5', 'Group'],
            ['navtabs6', 'Events'],
            ['navtabs7', 'Media']
          ].map(([id, label], i) => (
            <li key={i} className="list-inline-item me-5">
              {/* ❗ ссылки внутри страницы — лучше заменить <Link> на <a href="#..."> */}
              <a
                href={`#${id}`}
                className={`fw-700 font-xssss text-grey-500 pt-3 pb-3 ls-1 d-inline-block ${i === 0 ? 'active' : ''}`}
                data-toggle="tab"
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default ProfilecardThree
