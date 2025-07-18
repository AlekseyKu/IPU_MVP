// // frontend\src\components\modals\CreatepostModal.tsx
// 'use client'

// import { useState } from 'react'
// import { CreateModalState, useCreateModal } from '@/hooks/useCreateModal'
// import { X } from 'lucide-react'
// import CreatePromise from '../CreatePromise';

// interface Props {
//   onSubmit: (post: any) => void
// }

// const CreatepostModal = ({ onSubmit }: Props) => {
//   const isOpen = CreateModalState()
//   const { close } = useCreateModal()

//   const [title, setTitle] = useState('')

//   const handleSubmit = () => {
//     onSubmit({
//       id: String(Date.now()),
//       user: 'Current User',
//       time: 'Just now',
//       des: title,
//       avater: 'user.png',
//       postimage: 'post.png',
//       postvideo: '',
//     })
//     setTitle('')
//     close()
//   }

//   if (!isOpen) return null

//   return (
//     <div className="fixed top-0 left-0 w-full h-full bg-white z-50 p-4 overflow-y-auto">
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-lg font-bold">Создать обещание</h2>
//         <button onClick={close}>
//           <X />
//         </button>
//       </div>
//       <input
//         type="text"
//         value={title}
//         onChange={(e) => setTitle(e.target.value)}
//         placeholder="Название обещания"
//         className="border p-2 rounded w-full mb-4"
//       />
//       <button onClick={handleSubmit} className="bg-blue-500 text-white px-4 py-2 rounded">
//         Создать
//       </button>
//     </div>
//   )
// }

// export default CreatepostModal
