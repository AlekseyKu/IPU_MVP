// frontend/src/app/layout.tsx
import './globals.scss';
import type { Metadata, Viewport } from 'next';
import { UserProvider, CreatePostModalProvider, CreateChallengeModalProvider } from '@/context/UserContext';
import TelegramExpand from '@/components/TelegramExpand';
import Createpost from '@/components/Createpost';
import CreateChallenge from '@/components/Createchallenge';

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
            <CreateChallengeModalProvider>
              <TelegramExpand />
              {children}
              <Createpost />
              <CreateChallenge />
            </CreateChallengeModalProvider>
          </CreatePostModalProvider>
        </UserProvider>
      </body>
    </html>
  );
}