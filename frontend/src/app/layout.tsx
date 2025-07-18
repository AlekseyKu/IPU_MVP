// frontend/src/app/layout.tsx
import './globals.scss';
import type { Metadata, Viewport } from 'next';
import { UserProvider, CreatePostModalProvider, CreateChallengeModalProvider } from '@/context/UserContext';
import TelegramExpand from '@/components/TelegramExpand';
import PromiseCreate from '@/components/PromiseCreate';
import ChallengeCreate from '@/components/ChallengeCreate';

export const metadata: Metadata = {
  title: 'IPU App',
  description: 'Social challenge platform',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  minimumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head />
      <body suppressHydrationWarning>
        <UserProvider>
          <CreatePostModalProvider>
            <PromiseCreate />
            <CreateChallengeModalProvider>
              <TelegramExpand />
              {children}
              <ChallengeCreate />
            </CreateChallengeModalProvider>
          </CreatePostModalProvider>
        </UserProvider>
      </body>
    </html>
  );
}