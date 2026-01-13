'use client'

import { useEffect, useState } from 'react'

export interface TelegramUser {
  id: number
  first_name: string
  last_name?: string
  username?: string
  language_code?: string
  is_premium?: boolean
  photo_url?: string
}

export interface TelegramTheme {
  bg_color?: string
  text_color?: string
  hint_color?: string
  link_color?: string
  button_color?: string
  button_text_color?: string
  secondary_bg_color?: string
}

export interface TelegramWebApp {
  initData: string
  initDataUnsafe: {
    user?: TelegramUser
    auth_date: number
    hash: string
  }
  version: string
  platform: string
  colorScheme: 'light' | 'dark'
  themeParams: TelegramTheme
  isExpanded: boolean
  viewportHeight: number
  viewportStableHeight: number
  headerColor: string
  backgroundColor: string
  BackButton: {
    isVisible: boolean
    onClick: (callback: () => void) => void
    offClick: (callback: () => void) => void
    show: () => void
    hide: () => void
  }
  MainButton: {
    text: string
    color: string
    textColor: string
    isVisible: boolean
    isActive: boolean
    isProgressVisible: boolean
    setText: (text: string) => void
    onClick: (callback: () => void) => void
    offClick: (callback: () => void) => void
    show: () => void
    hide: () => void
    enable: () => void
    disable: () => void
    showProgress: (leaveActive?: boolean) => void
    hideProgress: () => void
    setParams: (params: {
      text?: string
      color?: string
      text_color?: string
      is_active?: boolean
      is_visible?: boolean
    }) => void
  }
  HapticFeedback: {
    impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void
    notificationOccurred: (type: 'error' | 'success' | 'warning') => void
    selectionChanged: () => void
  }
  ready: () => void
  expand: () => void
  close: () => void
  sendData: (data: string) => void
  openLink: (url: string, options?: { try_instant_view?: boolean }) => void
  openTelegramLink: (url: string) => void
  showPopup: (params: {
    title?: string
    message: string
    buttons?: Array<{
      id?: string
      type?: 'default' | 'ok' | 'close' | 'cancel' | 'destructive'
      text: string
    }>
  }, callback?: (id: string) => void) => void
  showAlert: (message: string, callback?: () => void) => void
  showConfirm: (message: string, callback?: (confirmed: boolean) => void) => void
}

export function useTelegram() {
  const [webApp, setWebApp] = useState<TelegramWebApp | null>(null)
  const [isReady, setIsReady] = useState(false)
  const [isDevMode, setIsDevMode] = useState(false)

  useEffect(() => {
    const checkTelegram = () => {
      // Проверяем, запущено ли приложение в Telegram
      if (typeof window === 'undefined') return false
      
      // Проверяем по user agent (Telegram WebView)
      const isTelegramWebView = 
        window.navigator.userAgent.includes('Telegram') ||
        window.navigator.userAgent.includes('WebApp')
      
      // Проверяем наличие Telegram WebApp API
      if (window.Telegram?.WebApp) {
        const tg = window.Telegram.WebApp
        
        // Инициализируем приложение
        tg.ready()
        tg.expand()

        setWebApp(tg as TelegramWebApp)
        setIsReady(true)
        setIsDevMode(false)
        return true
      }
      
      // Если user agent указывает на Telegram, но API еще не загружен, ждем
      if (isTelegramWebView) {
        return false // Продолжаем ждать
      }
      
      return false
    }

    // Первая проверка
    if (checkTelegram()) {
      return
    }

    // Если не найдено, ждем загрузки скрипта и проверяем еще раз
    let found = false
    const checkInterval = setInterval(() => {
      if (checkTelegram()) {
        found = true
        clearInterval(checkInterval)
      }
    }, 50) // Проверяем каждые 50мс

    // Останавливаем проверку через 2 секунды
    const timeout = setTimeout(() => {
      clearInterval(checkInterval)
      
      // Если за 2 секунды не нашли Telegram, переключаемся в dev режим
      if (!found && typeof window !== 'undefined' && !window.Telegram?.WebApp) {
        setIsDevMode(true)
        setIsReady(true)
        
        // Создаем мок для разработки
        const mockWebApp = {
        initData: '',
        initDataUnsafe: {
          user: {
            id: 123456789,
            first_name: 'Test',
            last_name: 'User',
            username: 'testuser',
            language_code: 'ru',
            is_premium: false,
          },
          auth_date: Math.floor(Date.now() / 1000),
          hash: 'mock_hash',
        },
        version: '6.0',
        platform: 'web',
        colorScheme: 'light' as const,
        themeParams: {
          bg_color: '#ffffff',
          text_color: '#000000',
          hint_color: '#999999',
          link_color: '#2481cc',
          button_color: '#2481cc',
          button_text_color: '#ffffff',
          secondary_bg_color: '#f1f1f1',
        },
        isExpanded: true,
        viewportHeight: window.innerHeight,
        viewportStableHeight: window.innerHeight,
        headerColor: '#ffffff',
        backgroundColor: '#ffffff',
        BackButton: {
          isVisible: false,
          onClick: () => {},
          offClick: () => {},
          show: () => {},
          hide: () => {},
        },
        MainButton: {
          text: 'Continue',
          color: '#2481cc',
          textColor: '#ffffff',
          isVisible: false,
          isActive: true,
          isProgressVisible: false,
          setText: () => {},
          onClick: () => {},
          offClick: () => {},
          show: () => {},
          hide: () => {},
          enable: () => {},
          disable: () => {},
          showProgress: () => {},
          hideProgress: () => {},
          setParams: () => {},
        },
        HapticFeedback: {
          impactOccurred: () => {},
          notificationOccurred: () => {},
          selectionChanged: () => {},
        },
        ready: () => {},
        expand: () => {},
        close: () => {},
        sendData: () => {},
        openLink: () => {},
        openTelegramLink: () => {},
        showPopup: () => {},
        showAlert: () => {},
        showConfirm: () => {},
      } as TelegramWebApp

        setWebApp(mockWebApp)
      }
    }, 3000)

    return () => {
      clearInterval(checkInterval)
      clearTimeout(timeout)
    }
  }, [])

  return {
    webApp,
    isReady,
    isDevMode,
    user: webApp?.initDataUnsafe.user,
    theme: webApp?.themeParams,
    colorScheme: webApp?.colorScheme || 'light',
  }
}

