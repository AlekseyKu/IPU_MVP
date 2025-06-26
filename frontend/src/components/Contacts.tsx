// frontend\src\components\Contacts.tsx
'use client'

import React from 'react'
import Link from 'next/link'

const contactList = [
  { imageUrl: 'user.png', name: 'Armany Seary', friend: '45' },
  { imageUrl: 'user.png', name: 'Mohannad Zitoun', friend: '18' },
  { imageUrl: 'user.png', name: 'Hurin Seary', friend: '28' },
]

const Contacts: React.FC = () => {
  return (
    <div className="card w-100 shadow-xss rounded-xxl border-0 mb-3">
      <div className="card-body d-flex align-items-center p-4">
        <h4 className="fw-700 mb-0 font-xssss text-grey-900">Confirm Friend</h4>
        <Link href="/defaultmember" className="fw-600 ms-auto font-xssss text-primary">See all</Link>
      </div>
      {contactList.map((value, index) => (
        <div
          key={index}
          className="card-body bg-transparent-card d-flex p-3 bg-greylight ms-3 me-3 rounded-3 mb-3"
        >
          <figure className="avatar me-2 mb-0">
            <img
              src={`/assets/images/${value.imageUrl}`}
              alt="avatar"
              className="shadow-sm rounded-circle w45"
            />
          </figure>
          <h4 className="fw-700 text-grey-900 font-xssss mt-2">
            {value.name}
            <span className="d-block font-xssss fw-500 mt-1 lh-3 text-grey-500">
              {value.friend} mutual friends
            </span>
          </h4>
          <Link href="/defaultmember" className="btn-round-sm bg-white ms-auto mt-2">
            <span className="feather-chevron-right font-xss text-grey-900" />
          </Link>
        </div>
      ))}
    </div>
  )
}

export default Contacts
