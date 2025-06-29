// frontend\src\app\layout.tsx
import './globals.scss'
import type { Metadata } from 'next'
import TelegramExpand from '@/components/TelegramExpand'

export const metadata: Metadata = {
  title: 'IPU App',
  description: 'Social challenge platform',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <TelegramExpand />
        {children}
      </body>
    </html>
  )
}