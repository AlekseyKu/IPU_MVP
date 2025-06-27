// frontend\src\components\ProfilecardThree.tsx
'use client'

// import Link from 'next/link'
import React from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

interface Props {
  onToggleDetail?: () => void
  isOpen?: boolean
}

const ProfilecardThree: React.FC<Props> = ({ onToggleDetail, isOpen = false }) => {
  const tabs = [
    { id: 'navtabs1', label: 'Подписчики', count: 128 },
    { id: 'navtabs2', label: 'Обещания', count: 34 },
    { id: 'navtabs3', label: 'Выпонено', count: 12 },
    { id: 'navtabs4', label: 'Звезды', count: 5 },
  ]

  return (
    <div className="card w-100 border-0 p-0 bg-white shadow-xss rounded-xxl">
      <div className="card-body h250 p-0 rounded-xxl overflow-hidden m-3" style={{ height: '150px' }}>
        <img src="/assets/images/comingsoon.svg" alt="avater" />
      </div>

      <div className="card-body p-0 position-relative">
        <figure className="avatar position-absolute w100 z-index-1" style={{ top: '-40px', left: '30px' }}>
          <img
            src="/assets/images/user.png"
            alt="avatar"
            className="float-right p-1 bg-white rounded-circle w-100"
          />
        </figure>

        <div className="d-flex align-items-center justify-content-between pe-3">
          <h4 className="fw-500 font-sm mt-0 mb-lg-5 mb-0" style={{ paddingLeft: '140px' }}>
            Mohannad Zitoun
            <span className="fw-500 font-xssss text-grey-500 mt-1 mb-3 d-block">support@gmail.com</span>
          </h4>

          {onToggleDetail && (
            <button
              onClick={onToggleDetail}
              className="bg-greylight rounded-circle p-2 d-flex align-items-center justify-content-center border-0"
              title="Toggle Profile Detail"
            >
              {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          )}
        </div>
      </div>

      <div className="card-body d-block w-100 shadow-none mb-0 mt-2 pt-2 p-0 border-top-xs">
        <ul className="nav nav-tabs h55 d-flex product-info-tab ps-4 justify-content-between border-bottom-0" id="pills-tab" role="tablist">
          {tabs.map(({ id, label, count }, i) => (
            <li key={i} className="list-inline-item me-5 text-center">
              {/* <a
                href={`#${id}`}
                className={`fw-500 font-xssss text-dark pt-2 ls-1 d-inline-block border-0 border-bottom-0${i === 0 ? 'active' : ''}`}
                data-toggle="tab"
                style={{ textDecoration: 'none' }}
              > */}
                <div className="fw-400 font-xss mb-0">{count}</div>
                <div className="fw-400 font-xssss text-dark">{label}</div>
              {/* </a> */}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default ProfilecardThree
