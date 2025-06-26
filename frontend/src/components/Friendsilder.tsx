// frontend\src\components\Friendsilder.tsx
'use client'

import React from 'react'
import Slider from 'react-slick'
import Link from 'next/link'

interface Friend {
  bgUrl: string
  imageUrl: string
  name: string
  email: string
}

const friendList: Friend[] = [
  {
    bgUrl: 'story.png',
    imageUrl: 'user.png',
    name: 'Aliqa Macale ',
    email: '@AliqaMacale',
  },
  {
    bgUrl: 'story.png',
    imageUrl: 'user.png',
    name: 'Seary Victor ',
    email: '@SearyVictor',
  },
  {
    bgUrl: 'story.png',
    imageUrl: 'user.png',
    name: 'John Steere ',
    email: '@JohnSteere',
  },
  {
    bgUrl: 'story.png',
    imageUrl: 'user.png',
    name: 'Mohannad Zitoun ',
    email: '@MohannadZitoun',
  },
  {
    bgUrl: 'story.png',
    imageUrl: 'user.png',
    name: 'Studio Express ',
    email: '@StudioExpress',
  },
  {
    bgUrl: 'story.png',
    imageUrl: 'user.png',
    name: 'Hendrix Stamp ',
    email: '@HendrixStamp',
  },
  {
    bgUrl: 'story.png',
    imageUrl: 'user.png',
    name: 'Mohannad Zitoun ',
    email: '@MohannadZitoun',
  },
]

const Friendsilder: React.FC = () => {
  const settings = {
    arrows: false,
    dots: false,
    infinite: true,
    speed: 300,
    slidesToShow: 1,
    centerMode: false,
    variableWidth: true,
  }

  return (
    <Slider {...settings}>
      {friendList.map((friend, index) => (
        <div
          key={index}
          className="card w150 d-block border-0 shadow-xss rounded-3 overflow-hidden mb-3 me-3"
        >
          <div className="card-body d-block w-100 ps-3 pe-3 pb-4 text-center">
            <figure className="overflow-hidden avatar ms-auto me-auto mb-0 position-relative w65 z-index-1">
              <img
                src={`/assets/images/${friend.imageUrl}`}
                alt="avatar"
                className="float-right p-0 bg-white rounded-circle w-100 shadow-xss"
              />
            </figure>
            <div className="clearfix"></div>
            <h4 className="fw-700 font-xssss mt-3 mb-1 d-block w-100">
              {friend.name}
            </h4>
            <p className="fw-500 font-xsssss text-grey-500 mt-0 mb-3 lh-2">
              {friend.email}
            </p>
            <Link
              href="/"
              className="text-center p-2 lh-20 w100 ms-1 ls-3 d-inline-block rounded-xl bg-success font-xsssss fw-700 ls-lg text-white"
            >
              FOLLOW
            </Link>
          </div>
        </div>
      ))}
    </Slider>
  )
}

export default Friendsilder
