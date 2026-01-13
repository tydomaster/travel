'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useTelegram } from '@/hooks/useTelegram'

interface TelegramHeaderProps {
  title?: string
  showBack?: boolean
  onBack?: () => void
}

export default function TelegramHeader({
  title,
  showBack = true,
  onBack,
}: TelegramHeaderProps) {
  const { webApp, isReady, isDevMode } = useTelegram()
  const router = useRouter()

  useEffect(() => {
    if (!webApp || !isReady) return

    const handleBack = () => {
      if (onBack) {
        onBack()
      } else {
        router.back()
      }
    }

    if (showBack) {
      webApp.BackButton.show()
      webApp.BackButton.onClick(handleBack)
    } else {
      webApp.BackButton.hide()
    }

    return () => {
      if (webApp.BackButton) {
        webApp.BackButton.offClick(handleBack)
      }
    }
  }, [webApp, isReady, showBack, onBack, router])

  // В dev режиме показываем обычную кнопку назад
  if (isDevMode && showBack) {
    return (
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center">
        <button
          onClick={() => (onBack ? onBack() : router.back())}
          className="mr-3 text-gray-700 hover:text-gray-900"
        >
          ← Назад
        </button>
        {title && (
          <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
        )}
      </div>
    )
  }

  // В Telegram хедер управляется через Telegram API
  // Здесь можно добавить дополнительный контент, если нужно
  return null
}

