// frontend\src\app\layout.tsx
import './globals.scss'
import type { Metadata, Viewport } from 'next'
import { UserProvider, CreatePostModalProvider } from '@/context/UserContext'
import TelegramExpand from '@/components/TelegramExpand'
import Createpost from '@/components/Createpost'

export const metadata: Metadata = {
  title: 'IPU App',
  description: 'Social challenge platform',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  minimumScale: 1,
  userScalable: false,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <UserProvider>
          <CreatePostModalProvider>
            <TelegramExpand />
            {children}
            <Createpost /> {/* Глобальный рендеринг попапа */}
          </CreatePostModalProvider>
        </UserProvider>
      </body>
    </html>
  )
}