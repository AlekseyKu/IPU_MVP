// frontend\src\components\Friends.tsx
'use client'

import React from 'react'
import Link from 'next/link'

const friendList = [
  { imageUrl: 'user.png', name: 'Anthony Daugloi', friend: '12' },
  { imageUrl: 'user.png', name: 'Mohannad Zitoun', friend: '18' },
  { imageUrl: 'user.png', name: 'Hurin Seary', friend: '28' },
]

const Friends: React.FC = () => {
  return (
    <div className="card w-100 shadow-xss rounded-xxl border-0 mb-3">
      <div className="card-body d-flex align-items-center p-4">
        <h4 className="fw-700 mb-0 font-xssss text-grey-900">Friend Request</h4>
        <Link href="/defaultmember" className="fw-600 ms-auto font-xssss text-primary">
          See all
        </Link>
      </div>

      {friendList.map((value, index) => (
        <div className="wrap" key={index}>
          <div className="card-body d-flex pt-0 ps-4 pe-4 pb-0 bor-0">
            <figure className="avatar me-3">
              <img
                src={`/assets/images/${value.imageUrl}`}
                alt="avatar"
                className="shadow-sm rounded-circle w45"
              />
            </figure>
            <h4 className="fw-700 text-grey-900 font-xssss mt-1">
              {value.name}
              <span className="d-block font-xssss fw-500 mt-1 lh-3 text-grey-500">
                {value.friend} mutual friends
              </span>
            </h4>
          </div>
          <div className="card-body d-flex align-items-center pt-0 ps-4 pe-4 pb-4">
            <Link
              href="/defaultmember"
              className="p-2 lh-20 w100 bg-primary-gradiant me-2 text-white text-center font-xssss fw-600 ls-1 rounded-xl"
            >
              Confirm
            </Link>
            <Link
              href="/defaultmember"
              className="p-2 lh-20 w100 bg-grey text-grey-800 text-center font-xssss fw-600 ls-1 rounded-xl"
            >
              Delete
            </Link>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Friends
