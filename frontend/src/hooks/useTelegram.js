import { useEffect, useState } from 'react'

declare global {
  interface Window {
    Telegram: any
  }
}

export const useTelegram = () => {
  const [tg, setTg] = useState(null)

  useEffect(() => {
    if (window.Telegram && window.Telegram.WebApp) {
      const webApp = window.Telegram.WebApp
      webApp.ready()
      webApp.expand()
      setTg(webApp)
    } else {
      console.warn("Telegram WebApp SDK не загружен")
    }
  }, [])

  return { tg }
}
