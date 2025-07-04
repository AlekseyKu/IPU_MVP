// frontend/src/components/ProfilecardThree.tsx
'use client'

import React from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

interface Props {
  onToggleDetail?: () => void
  isOpen?: boolean
  nickname?: string
  fullName: string;
  telegramId?: number
  subscribers?: number
  promises?: number
  promisesDone?: number
  stars?: number
}

const ProfilecardThree: React.FC<Props> = ({
  onToggleDetail,
  isOpen = false,
  nickname = 'Mohannad Zitoun',
  fullName = 'Guest',
  telegramId = 0,
  subscribers = 0,
  promises = 0,
  promisesDone = 0,
  stars = 0,
}) => {
  const tabs = [
    { id: 'navtabs1', label: 'Подписчики', count: subscribers },
    { id: 'navtabs2', label: 'Обещания', count: promises },
    { id: 'navtabs3', label: 'Выполнено', count: promisesDone },
    { id: 'navtabs4', label: 'Звезды', count: stars },
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
            {fullName}
            <span className="fw-500 font-xssss text-grey-500 mt-1 mb-3 d-block">@{nickname}</span>
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
        <ul
          className="nav nav-tabs h55 d-flex product-info-tab ps-0 border-bottom-0 w-100"
          id="pills-tab"
          role="tablist"
        >
          {tabs.map(({ label, count }, i) => (
            <li
              key={i}
              className="flex-fill d-flex flex-column align-items-center justify-content-center text-center me-0"
            >
              <div className="fw-400 font-xss mb-0">{count}</div>
              <div className="fw-400 font-xssss text-dark">{label}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default ProfilecardThree