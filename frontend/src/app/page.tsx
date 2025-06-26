// frontend\src\app\page.tsx
'use client'

import { Fragment } from 'react'

import Header from '@/components/Header'
import Leftnav from '@/components/Leftnav'
import Rightchat from '@/components/Rightchat'
import Appfooter from '@/components/Appfooter'
import Popupchat from '@/components/Popupchat'
import Postview from '@/components/Postview'
import Events from '@/components/Events'
import Createpost from '@/components/Createpost'
import Load from '@/components/Load'
import Profilephoto from '@/components/Profilephoto'
import ProfilecardThree from '@/components/ProfilecardThree'
import Profiledetail from '@/components/Profiledetail'

export default function Page() {
  return (
    <Fragment>
      <Header />
      <Leftnav />
      <Rightchat />

      <div className="main-content right-chat-active">
        <div className="middle-sidebar-bottom">
          <div className="middle-sidebar-left pe-0">
            <div className="row">
              <div className="col-xl-12 mb-3">
                <ProfilecardThree />
              </div>
              <div className="col-xl-4 col-xxl-3 col-lg-4 pe-0">
                <Profiledetail />
                <Profilephoto />
                <Events />
              </div>
              <div className="col-xl-8 col-xxl-9 col-lg-8">
                <Createpost />
                <Postview
                  id="32"
                  postvideo=""
                  postimage="post.png"
                  avater="user.png"
                  user="Surfiya Zakir"
                  time="22 min ago"
                  des="Lorem ipsum dolor sit amet..."
                />
                <Postview
                  id="31"
                  postvideo=""
                  postimage="post.png"
                  avater="user.png"
                  user="David Goria"
                  time="22 min ago"
                  des="Lorem ipsum dolor sit amet..."
                />
                <Postview
                  id="33"
                  postvideo=""
                  postimage="post.png"
                  avater="user.png"
                  user="Anthony Daugloi"
                  time="2 hour ago"
                  des="Lorem ipsum dolor sit amet..."
                />
                <Load />
              </div>
            </div>
          </div>
        </div>
      </div>

      <Popupchat />
      <Appfooter />
    </Fragment>
  )
}
