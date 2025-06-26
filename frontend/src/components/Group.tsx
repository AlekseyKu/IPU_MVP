// frontend\src\components\Group.tsx
'use client'

import React from 'react'
import Link from 'next/link'

const groupList = [
  { imageUrl: 'group.svg', name: 'Studio Express', friend: '12' },
  { imageUrl: 'group.svg', name: 'Armany Design', friend: '18' },
]

const Group: React.FC = () => {
  return (
    <div className="card w-100 shadow-xss rounded-xxl border-0 mb-3">
      <div className="card-body d-flex align-items-center p-4">
        <h4 className="fw-700 mb-0 font-xssss text-grey-900">Suggest Pages</h4>
        <Link href="/defaultmember" className="fw-600 ms-auto font-xssss text-primary">
          See all
        </Link>
      </div>

      {groupList.map((value, index) => (
        <div className="wrap" key={index}>
          <div className="card-body d-flex pt-0 ps-4 pe-4 pb-0 overflow-hidden bor-0">
            <img
              src={`/assets/images/${value.imageUrl}`}
              alt="group"
              className="img-fluid rounded-xxl mb-2"
            />
          </div>
          <div className="card-body d-flex align-items-center pt-0 ps-4 pe-4 pb-4">
            <Link
              href="/defaultgroup"
              className="p-2 lh-28 w-100 bg-grey text-grey-800 text-center font-xssss fw-700 rounded-xl"
            >
              <i className="feather-external-link font-xss me-2"></i> Like Page
            </Link>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Group
