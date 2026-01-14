'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import TelegramHeader from '@/components/TelegramHeader'
import { joinTrip } from '@/lib/api/trips'
import { useTelegram } from '@/hooks/useTelegram'
import { getStartParam } from '@/utils/telegramLinks'

export default function JoinTripPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { webApp, isReady } = useTelegram()
  
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Получаем токен из URL параметра
    const urlToken = searchParams.get('token')
    
    // Если есть токен в URL, используем его
    if (urlToken) {
      console.log('Token from URL:', urlToken)
      setToken(urlToken)
      return
    }
    
    // Если нет токена в URL, ждем инициализации Telegram и получаем start_param
    if (isReady && webApp) {
      const startParamToken = getStartParam()
      console.log('Start param from Telegram:', startParamToken)
      if (startParamToken) {
        setToken(startParamToken)
      } else {
        // Не показываем ошибку сразу, возможно Telegram еще не инициализировался
        console.log('No start_param found, waiting...')
      }
    }
  }, [searchParams, isReady, webApp])

  useEffect(() => {
    if (token) {
      handleJoin()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  const handleJoin = async () => {
    if (!token) return

    try {
      setLoading(true)
      console.log('Joining trip with token:', token)
      const trip = await joinTrip(token)
      console.log('Joined trip:', trip.id)
      router.push(`/trips/${trip.id}`)
    } catch (err) {
      console.error('Join trip error:', err)
      setError(err instanceof Error ? err.message : 'Ошибка присоединения к поездке')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: 'var(--tg-theme-bg-color, #ffffff)' }}
    >
      <TelegramHeader title="Присоединение к поездке" showBack={true} />
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading && (
          <div className="text-center">
            <p style={{ color: 'var(--tg-theme-text-color, #000000)' }}>
              Присоединение к поездке...
            </p>
          </div>
        )}

        {error && (
          <div
            className="rounded-lg p-6"
            style={{
              backgroundColor: 'var(--tg-theme-secondary-bg-color, #f1f1f1)',
            }}
          >
            <p style={{ color: '#ef4444' }} className="mb-4">
              {error}
            </p>
            <button
              onClick={() => router.push('/trips')}
              className="px-4 py-2 rounded-lg font-medium transition opacity-90 hover:opacity-100"
              style={{
                backgroundColor: 'var(--tg-theme-button-color, #2481cc)',
                color: 'var(--tg-theme-button-text-color, #ffffff)',
              }}
            >
              Вернуться к поездкам
            </button>
          </div>
        )}

        {!loading && !error && !token && (
          <div className="text-center">
            <p style={{ color: 'var(--tg-theme-text-color, #000000)' }}>
              Ожидание токена приглашения...
            </p>
          </div>
        )}
      </main>
    </div>
  )
}

