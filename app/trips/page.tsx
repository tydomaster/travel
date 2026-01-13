'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Navigation from '@/components/Navigation'
import TelegramHeader from '@/components/TelegramHeader'
import { getMyTrips, Trip } from '@/lib/api/trips'

export default function TripsPage() {
  const [trips, setTrips] = useState<Trip[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    loadTrips()
  }, [])

  const loadTrips = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getMyTrips()
      setTrips(data)
    } catch (err) {
      console.error('Error loading trips:', err)
      const errorMessage = err instanceof Error ? err.message : 'Ошибка загрузки поездок'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Даты не указаны'
    const date = new Date(dateString)
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: 'var(--tg-theme-bg-color, #ffffff)' }}
    >
      <TelegramHeader title="Мои поездки" showBack={false} />
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1
              className="text-3xl font-bold mb-2"
              style={{ color: 'var(--tg-theme-text-color, #000000)' }}
            >
              Мои поездки
            </h1>
            <p style={{ color: 'var(--tg-theme-hint-color, #999999)' }}>
              Управляйте своими поездками
            </p>
          </div>
          <Link
            href="/trips/create"
            className="px-4 py-2 rounded-lg font-medium transition opacity-90 hover:opacity-100"
            style={{
              backgroundColor: 'var(--tg-theme-button-color, #2481cc)',
              color: 'var(--tg-theme-button-text-color, #ffffff)',
            }}
          >
            + Создать
          </Link>
        </div>

        {loading && (
          <div
            className="rounded-lg p-8 text-center"
            style={{
              backgroundColor: 'var(--tg-theme-secondary-bg-color, #f1f1f1)',
            }}
          >
            <p style={{ color: 'var(--tg-theme-hint-color, #999999)' }}>
              Загрузка...
            </p>
          </div>
        )}

        {error && (
          <div
            className="rounded-lg p-4 mb-4"
            style={{
              backgroundColor: 'var(--tg-theme-secondary-bg-color, #f1f1f1)',
            }}
          >
            <p style={{ color: '#ef4444' }}>{error}</p>
            <button
              onClick={loadTrips}
              className="mt-2 text-sm underline"
              style={{ color: 'var(--tg-theme-link-color, #2481cc)' }}
            >
              Попробовать снова
            </button>
          </div>
        )}

        {!loading && !error && trips.length === 0 && (
          <div
            className="rounded-lg p-8 text-center"
            style={{
              backgroundColor: 'var(--tg-theme-secondary-bg-color, #f1f1f1)',
            }}
          >
            <p
              className="mb-4"
              style={{ color: 'var(--tg-theme-hint-color, #999999)' }}
            >
              У вас пока нет поездок
            </p>
            <Link
              href="/trips/create"
              className="inline-block px-6 py-3 rounded-lg font-medium transition opacity-90 hover:opacity-100"
              style={{
                backgroundColor: 'var(--tg-theme-button-color, #2481cc)',
                color: 'var(--tg-theme-button-text-color, #ffffff)',
              }}
            >
              Создать поездку
            </Link>
          </div>
        )}

        {!loading && !error && trips.length > 0 && (
          <div className="space-y-4">
            {trips.map((trip) => (
              <Link
                key={trip.id}
                href={`/trips/${trip.id}`}
                className="block rounded-lg p-6 transition opacity-90 hover:opacity-100"
                style={{
                  backgroundColor: 'var(--tg-theme-secondary-bg-color, #f1f1f1)',
                }}
              >
                <div className="flex justify-between items-start mb-2">
                  <h2
                    className="text-xl font-semibold"
                    style={{ color: 'var(--tg-theme-text-color, #000000)' }}
                  >
                    {trip.title}
                  </h2>
                  {trip.role === 1 && (
                    <span
                      className="text-xs px-2 py-1 rounded"
                      style={{
                        backgroundColor: 'var(--tg-theme-button-color, #2481cc)',
                        color: 'var(--tg-theme-button-text-color, #ffffff)',
                      }}
                    >
                      Владелец
                    </span>
                  )}
                </div>
                <p
                  className="text-sm mb-2"
                  style={{ color: 'var(--tg-theme-hint-color, #999999)' }}
                >
                  {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
                </p>
                <div className="flex items-center gap-2">
                  <p
                    className="text-sm"
                    style={{ color: 'var(--tg-theme-hint-color, #999999)' }}
                  >
                    Участников: {trip.members.length}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

