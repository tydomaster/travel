'use client'

import { useEffect } from 'react'
import { useTelegram } from '@/hooks/useTelegram'

interface TelegramProviderProps {
  children: React.ReactNode
}

export default function TelegramProvider({ children }: TelegramProviderProps) {
  const { webApp, isReady, isDevMode, theme, colorScheme } = useTelegram()

  useEffect(() => {
    // Загружаем Telegram Web Apps SDK если его нет
    if (typeof window !== 'undefined' && !window.Telegram?.WebApp) {
      const script = document.createElement('script')
      script.src = 'https://telegram.org/js/telegram-web-app.js'
      script.async = true
      document.head.appendChild(script)
    }
  }, [])

  useEffect(() => {
    if (!webApp || !isReady) return

    // Применяем тему Telegram
    if (theme) {
      const root = document.documentElement
      
      if (theme.bg_color) {
        root.style.setProperty('--tg-theme-bg-color', theme.bg_color)
        document.body.style.backgroundColor = theme.bg_color
      }
      
      if (theme.text_color) {
        root.style.setProperty('--tg-theme-text-color', theme.text_color)
        document.body.style.color = theme.text_color
      }
      
      if (theme.hint_color) {
        root.style.setProperty('--tg-theme-hint-color', theme.hint_color)
      }
      
      if (theme.link_color) {
        root.style.setProperty('--tg-theme-link-color', theme.link_color)
      }
      
      if (theme.button_color) {
        root.style.setProperty('--tg-theme-button-color', theme.button_color)
      }
      
      if (theme.button_text_color) {
        root.style.setProperty('--tg-theme-button-text-color', theme.button_text_color)
      }
      
      if (theme.secondary_bg_color) {
        root.style.setProperty('--tg-theme-secondary-bg-color', theme.secondary_bg_color)
      }
    }

    // Устанавливаем viewport height для корректного отображения
    const setViewportHeight = () => {
      const vh = webApp.viewportHeight || window.innerHeight
      document.documentElement.style.setProperty('--tg-viewport-height', `${vh}px`)
    }

    setViewportHeight()
    
    // Обновляем при изменении viewport
    if (webApp.viewportHeight) {
      const handleViewportChange = () => {
        setViewportHeight()
      }
      
      // Слушаем события изменения viewport
      window.addEventListener('resize', handleViewportChange)
      window.addEventListener('orientationchange', handleViewportChange)
      
      return () => {
        window.removeEventListener('resize', handleViewportChange)
        window.removeEventListener('orientationchange', handleViewportChange)
      }
    }
  }, [webApp, isReady, theme])

  return (
    <>
      {/* Показываем предупреждение в dev режиме */}
      {isDevMode && (
        <div className="bg-yellow-100 border-b border-yellow-400 text-yellow-800 px-4 py-2 text-sm text-center">
          ⚠️ Dev режим: приложение открыто не из Telegram. Используются мок-данные.
        </div>
      )}
      
      {children}
    </>
  )
}

