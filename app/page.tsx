'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Navigation from '@/components/Navigation'
import { useTelegram } from '@/hooks/useTelegram'
import { getStartParam } from '@/utils/telegramLinks'

export default function Home() {
  const router = useRouter()
  const { user, isDevMode, webApp, isReady } = useTelegram()

  // Обрабатываем start_param при открытии приложения через deep link
  useEffect(() => {
    if (isReady && webApp) {
      const startParam = getStartParam()
      if (startParam) {
        // Если есть start_param (токен приглашения), перенаправляем на страницу join
        console.log('Start param found:', startParam)
        router.push(`/trips/join?token=${startParam}`)
      }
    }
  }, [isReady, webApp, router])

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: 'var(--tg-theme-bg-color, #ffffff)' }}
    >
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1
            className="text-4xl font-bold mb-4"
            style={{ color: 'var(--tg-theme-text-color, #000000)' }}
          >
            Планировщик групповых поездок
          </h1>
          <p
            className="text-xl mb-8"
            style={{ color: 'var(--tg-theme-hint-color, #666666)' }}
          >
            Создавайте и планируйте поездки вместе с друзьями
          </p>
          {user && (
            <p
              className="mb-4 text-sm"
              style={{ color: 'var(--tg-theme-hint-color, #999999)' }}
            >
              Привет, {user.first_name}!
            </p>
          )}
          <Link
            href="/trips"
            className="inline-block px-6 py-3 rounded-lg font-medium transition opacity-90 hover:opacity-100"
            style={{
              backgroundColor: 'var(--tg-theme-button-color, #2481cc)',
              color: 'var(--tg-theme-button-text-color, #ffffff)',
            }}
          >
            Начать планирование
          </Link>
        </div>
      </main>
    </div>
  )
}

