// frontend\src\hooks\useCreateModal.ts
import { useState } from 'react'

let setState: ((value: boolean) => void) | null = null

export const useCreateModal = () => {
  const open = () => setState?.(true)
  const close = () => setState?.(false)
  return { open, close }
}

export const CreateModalState = () => {
  const [isOpen, setIsOpen] = useState(false)
  setState = setIsOpen
  return isOpen
}
