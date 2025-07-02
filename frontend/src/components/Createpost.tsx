// frontend\src\components\Createpost.tsx
'use client'

import React, { useState } from 'react'
import {
  Edit3,
  Video,
  Image as ImageIcon,
  Camera,
  MoreHorizontal,
  Bookmark,
  AlertCircle,
  AlertOctagon,
  Lock
} from 'lucide-react'

const Createpost: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const toggleOpen = () => setIsOpen((prev) => !prev)
  const menuClass = isOpen ? 'show' : ''

  return (
    <div className="card w-100 shadow-xss rounded-xxl border-0 ps-4 pt-4 pe-4 pb-3 mb-3">
      <div className="card-body p-0">
        <a
          href="/"
          className="font-xssss fw-600 text-grey-500 card-body p-0 d-flex align-items-center"
        >
          <Edit3 className="w-4 h-4 text-primary me-2 bg-greylight p-1 rounded-circle" />
          Создать обещание
        </a>
      </div>

      <div className="card-body p-0 mt-3 position-relative">
        {/* <figure className="avatar position-absolute ms-2 mt-1 top-5">
          <img
            src="assets/images/user.png"
            alt="icon"
            className="shadow-sm rounded-circle w30"
          />
        </figure> */}
        <textarea
          name="message"
          className="h100 bor-0 w-100 rounded-xxl p-2 ps-2 font-xssss text-grey-900 fw-500 border-light-md theme-dark-bg"
          cols={30}
          rows={10}
          placeholder="What's on your mind?"
        ></textarea>
      </div>

      <div className="card-body d-flex p-0 mt-0">
        <a
          href="#video"
          className="d-flex align-items-center font-xssss fw-600 ls-1 text-grey-700 text-dark pe-4"
        >
          <Video className="w-5 h-5 text-danger me-1" />
          <span className="d-none-xs">Live Video</span>
        </a>
        <a
          href="#photo"
          className="d-flex align-items-center font-xssss fw-600 ls-1 text-grey-700 text-dark pe-4"
        >
          <ImageIcon className="w-5 h-5 text-success me-1" />
          <span className="d-none-xs">Photo/Video</span>
        </a>
        <a
          href="#activity"
          className="d-flex align-items-center font-xssss fw-600 ls-1 text-grey-700 text-dark pe-4"
        >
          <Camera className="w-5 h-5 text-warning me-1" />
          <span className="d-none-xs">Feeling/Activity</span>
        </a>

        <div
          className={`ms-auto pointer ${menuClass}`}
          id="dropdownMenu4"
          data-bs-toggle="dropdown"
          aria-expanded={isOpen}
          onClick={toggleOpen}
        >
          <MoreHorizontal className="w-5 h-5 text-grey-900 bg-greylight p-1 rounded-circle" />
        </div>

        <div
          className={`dropdown-menu p-4 right-0 rounded-xxl border-0 shadow-lg ${menuClass}`}
          aria-labelledby="dropdownMenu4"
        >
          <DropdownItem Icon={Bookmark} title="Save Link" desc="Add this to your saved items" />
          <DropdownItem Icon={AlertCircle} title="Hide Post" desc="Save to your saved items" />
          <DropdownItem Icon={AlertOctagon} title="Hide all from Group" desc="Save to your saved items" />
          <DropdownItem Icon={Lock} title="Unfollow Group" desc="Save to your saved items" />
        </div>
      </div>
    </div>
  )
}

interface DropdownItemProps {
  Icon: React.ElementType
  title: string
  desc: string
}

const DropdownItem: React.FC<DropdownItemProps> = ({ Icon, title, desc }) => (
  <div className="card-body p-0 d-flex mt-2">
    <Icon className="w-5 h-5 text-grey-500 me-3" />
    <h4 className="fw-600 text-grey-900 font-xssss mt-0 me-4 pointer">
      {title}
      <span className="d-block font-xsssss fw-500 mt-1 lh-3 text-grey-500">{desc}</span>
    </h4>
  </div>
)

export default Createpost
