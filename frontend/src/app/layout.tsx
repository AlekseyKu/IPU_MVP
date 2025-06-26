// frontend\src\app\layout.tsx
import './globals.scss'
import 'bootstrap/dist/css/bootstrap.min.css'
import type { Metadata } from 'next'


export const metadata: Metadata = {
  title: 'IPU App',
  description: 'Social challenge platform',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      {/* <body suppressHydrationWarning={true}>{children}</body> */}
      <body>{children}</body>
    </html>
  )
}
