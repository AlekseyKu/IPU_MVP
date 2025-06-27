// @config: Root layout for Next.js App Router
import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'IPU App',
  description: 'Social challenge platform',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>{children}</body>
    </html>
  );
}