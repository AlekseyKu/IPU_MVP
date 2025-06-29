// global.d.ts
export {}

declare global {
  interface Window {
    Telegram: {
      WebApp: {
        expand: () => void
        close: () => void
        initData: string
        initDataUnsafe: any
        onEvent: (eventType: string, callback: (...args: any[]) => void) => void
        offEvent: (eventType: string, callback: (...args: any[]) => void) => void
        sendData: (data: string) => void
        themeParams: Record<string, string>
        isExpanded?: boolean
        isFullscreen?: boolean
        ready?: () => void
        requestFullscreen?: () => void
        exitFullscreen?: () => void
        BackButton: {
          show: () => void
          hide: () => void
          onClick: (cb: () => void) => void
        }
      }
    }
  }
}
