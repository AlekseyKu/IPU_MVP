// frontend/src/app/layout.tsx
import './globals.scss';
import type { Metadata, Viewport } from 'next';
import { UserProvider, CreatePostModalProvider, CreateChallengeModalProvider } from '@/context/UserContext';
import { LanguageProvider } from '@/context/LanguageContext';
import TelegramExpand from '@/components/TelegramExpand';
import PromiseCreate from '@/components/PromiseCreate';
import ChallengeCreate from '@/components/ChallengeCreate';
import Script from 'next/script';

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
        <Script
          src="https://tganalytics.xyz/index.js"
          onLoad={() => {
            if (typeof window !== 'undefined' && window.telegramAnalytics) {
              window.telegramAnalytics.init({
                token: 'eyJhcHBfbmFtZSI6IklQVTEiLCJhcHBfdXJsIjoiaHR0cHM6Ly90Lm1lL2lwdV9wcm9taXNlX2JvdCIsImFwcF9kb21haW4iOiJodHRwczovL2lwdS1tdnAudmVyY2VsLmFwcCJ9!OtzcQR8VDmmUImFA2TtgGh4eSU/hDS1d/EXcnU/pRI8=',
                appName: 'IPU1',
              });
            }
          }}
          strategy="afterInteractive"
        />
        <UserProvider>
          <LanguageProvider>
            <CreatePostModalProvider>
              <PromiseCreate />
              <CreateChallengeModalProvider>
                <TelegramExpand />
                {children}
                <ChallengeCreate />
              </CreateChallengeModalProvider>
            </CreatePostModalProvider>
          </LanguageProvider>
        </UserProvider>
      </body>
    </html>
  );
}