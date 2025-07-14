// 'use client'

// import React, { useRef, useState } from 'react'
// import { usePathname, useRouter } from 'next/navigation'
// import { useUser, useCreatePostModal } from '@/context/UserContext'
// import {
//   House,
//   User,
//   CirclePlus,
//   BarChart2,
//   ShoppingCart,
//   Info
// } from 'lucide-react'
// import { Modal, Button, OverlayTrigger, Popover } from 'react-bootstrap'

// const Appfooter: React.FC = () => {
//   const pathname = usePathname()
//   const router = useRouter()
//   const { telegramId } = useUser()
//   const { setIsCreatePostOpen } = useCreatePostModal()
//   const [showModal, setShowModal] = useState(false)

//   // 👇 Ref на модальное тело
//   const modalContentRef = useRef<HTMLDivElement | null>(null)

//   const links = [
//     {
//       icon: User,
//       getHref: () => (telegramId ? `/user/${telegramId}` : '/'),
//       onClick: () => router.push(telegramId ? `/user/${telegramId}` : '/')
//     },
//     {
//       icon: House,
//       getHref: () => '/list',
//       onClick: () => router.push('/list')
//     },
//     {
//       icon: CirclePlus,
//       getHref: () => '#',
//       onClick: () => setShowModal(true)
//     },
//     {
//       icon: BarChart2,
//       getHref: () => '/leaders',
//       onClick: () => router.push('/leaders')
//     },
//     {
//       icon: ShoppingCart,
//       getHref: () => '/shop',
//       onClick: () => router.push('/shop')
//     }
//   ]

//   const CustomPopover = ({ id, children }: { id: string; children: React.ReactNode }) => (
//     <Popover id={id} className="popover-custom-op border-0 shadow-lg bg-white rounded">
//       <Popover.Body>{children}</Popover.Body>
//     </Popover>
//   )

//   return (
//     <>
//       <div className="app-footer border-0 shadow-lg bg-white d-flex justify-content-around align-items-center py-3">
//         {links.map(({ icon: Icon, getHref, onClick }, idx) => {
//           const href = getHref()
//           const isActive = pathname === href

//           return (
//             <button
//               key={idx}
//               onClick={(e) => {
//                 e.preventDefault()
//                 onClick()
//               }}
//               className="nav-content-bttn nav-center bg-transparent border-0 p-0"
//             >
//               <Icon
//                 style={{ color: isActive ? '#0066ff' : '#A0AEC0' }}
//                 className="w-6 h-6"
//               />
//             </button>
//           )
//         })}
//       </div>

//       <Modal
//         show={showModal}
//         onHide={() => setShowModal(false)}
//         dialogClassName="modal-bottom modal-overflow-visible p-3"
//         contentClassName="w-100"
//       >
//         <Modal.Body ref={modalContentRef}>
//           <div className="d-flex align-items-center mb-2">
//             <Button
//               variant="outline-primary"
//               className="w-100 me-2"
//               onClick={() => {
//                 setIsCreatePostOpen(true)
//                 setShowModal(false)
//               }}
//             >
//               Создать обещание
//             </Button>
//             {/* <OverlayTrigger
//               placement="top"
//               trigger={['hover', 'click']}
//               containerPadding={20}
//               container={modalContentRef.current ?? undefined}
//               rootClose
//               overlay={
//                 <CustomPopover id="popover-create-post">
//                   Создайте личное обещание, чтобы делиться прогрессом.
//                 </CustomPopover>
//               }
//             >
//               <div className="d-inline-block">
//                 <Info className="w-4 h-4 text-muted cursor-pointer" />
//               </div>
//             </OverlayTrigger> */}
//           </div>

//           <div className="d-flex align-items-center">
//             <Button
//               variant="outline-primary"
//               className="w-100 me-2"
//               onClick={() => router.push('/create-challenge')}
//             >
//               Создать челлендж
//             </Button>
//             {/* <OverlayTrigger
//               // placement="top"
//               trigger={['hover', 'click']}
//               // containerPadding={20}
//               // container={modalContentRef.current ?? undefined}
//               rootClose
//               overlay={
//                 <CustomPopover id="popover-create-challenge">
//                   Создайте публичный челлендж с отчетами и участниками.
//                 </CustomPopover>
//               }
//             >
//               <Info className="w-4 h-4 text-muted cursor-pointer" />
//             </OverlayTrigger> */}
//           </div>
//         </Modal.Body>
//       </Modal>
//     </>
//   )
// }

// export default Appfooter
