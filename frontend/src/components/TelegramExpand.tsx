'use client'

import { useEffect } from 'react'
import { isTMA, init, viewport } from '@telegram-apps/sdk'

export default function TelegramExpand() {
  useEffect(() => {
    async function enableFullscreen() {
      const insideTelegram = await isTMA()
      if (!insideTelegram) return

      init() // Инициализируем SDK

      if (viewport.mount.isAvailable()) {
        viewport.mount()
        viewport.expand()
      }

      if (viewport.requestFullscreen.isAvailable()) {
        try {
          await viewport.requestFullscreen()
          console.log('[TG] Fullscreen activated')
        } catch (err) {
          console.warn('[TG] Fullscreen request failed:', err)
        }
      }
    }

    enableFullscreen()
  }, [])

  return null
}
