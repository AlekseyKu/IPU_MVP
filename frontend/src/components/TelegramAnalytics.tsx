"use client";

import Script from "next/script";

export default function TelegramAnalytics() {
  return (
    <Script
      src="https://tganalytics.xyz/index.js"
      onLoad={() => {
        if (typeof window !== 'undefined' && (window as any).telegramAnalytics) {
          (window as any).telegramAnalytics.init({
            token: 'eyJhcHBfbmFtZSI6IklQVTEiLCJhcHBfdXJsIjoiaHR0cHM6Ly90Lm1lL2lwdV9wcm9taXNlX2JvdCIsImFwcF9kb21haW4iOiJodHRwczovL2lwdS1tdnAudmVyY2VsLmFwcCJ9!OtzcQR8VDmmUImFA2TtgGh4eSU/hDS1d/EXcnU/pRI8=',
            appName: 'IPU1',
          });
        }
      }}
      strategy="afterInteractive"
    />
  );
}
