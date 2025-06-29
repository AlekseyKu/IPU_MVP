// frontend\src\app\page.tsx
'use client'

import { Fragment, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

import Header from '@/components/Header'
import Leftnav from '@/components/Leftnav'
import Appfooter from '@/components/Appfooter'
import Postview from '@/components/Postview'
import Createpost from '@/components/Createpost'
import ProfilecardThree from '@/components/ProfilecardThree'
import Profiledetail from '@/components/Profiledetail'
import Load from '@/components/Load'
import CreatepostModal from '@/components/modals/CreatepostModal'


export default function Page() {
  const [showProfileDetail, setShowProfileDetail] = useState(false)

  return (
    <Fragment>
      <Header />
      <Leftnav />
      <div className="main-content">
        <div className="middle-sidebar-bottom">
          <div className="middle-sidebar-left pe-0">
            <div className="row">
              <div className="col-xl-12 mb-3">
                <ProfilecardThree onToggleDetail={() => setShowProfileDetail(prev => !prev)} isOpen={showProfileDetail} />
              </div>

              <div className="col-xl-4 col-xxl-3 col-lg-4">
                <AnimatePresence>
                  {showProfileDetail && (
                    <motion.div
                      initial={{ opacity: 0, y: 40 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 40 }}
                      transition={{ duration: 0.3, ease: 'easeOut' }}
                    >
                      <Profiledetail />
                    </motion.div>
                  )}
                </AnimatePresence>
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
      <Appfooter />
    </Fragment>
  )
}
