'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import TelegramHeader from '@/components/TelegramHeader'
import DayCard from '@/components/Itinerary/DayCard'
import { getDays, createDay, Day } from '@/lib/api/itinerary'
import { getTrip } from '@/lib/api/trips'

export default function ItineraryPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const tripId = Number(params.id)
  const [days, setDays] = useState<Day[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showAddDay, setShowAddDay] = useState(false)
  const [newDayDate, setNewDayDate] = useState('')
  const [creating, setCreating] = useState(false)
  const [trip, setTrip] = useState<{ startDate?: string; endDate?: string } | null>(null)

  const loadData = async () => {
    try {
      setLoading(true)
      const [daysData, tripData] = await Promise.all([
        getDays(tripId),
        getTrip(tripId),
      ])
      setDays(daysData)
      setTrip(tripData)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки маршрута')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tripId])

  const handleCreateDay = async () => {
    if (!newDayDate) return

    try {
      setCreating(true)
      const day = await createDay(tripId, { date: newDayDate })
      setDays([...days, day].sort((a, b) => 
        new Date(a.date).getTime() - new Date(b.date).getTime()
      ))
      setNewDayDate('')
      setShowAddDay(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка создания дня')
    } finally {
      setCreating(false)
    }
  }

  const getMinDate = () => {
    if (trip?.startDate) {
      return trip.startDate.split('T')[0]
    }
    return new Date().toISOString().split('T')[0]
  }

  const getMaxDate = () => {
    if (trip?.endDate) {
      return trip.endDate.split('T')[0]
    }
    return ''
  }

  if (loading) {
    return (
      <div
        className="min-h-screen"
        style={{ backgroundColor: 'var(--tg-theme-bg-color, #ffffff)' }}
      >
        <TelegramHeader title="Маршрут" showBack={true} />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p style={{ color: 'var(--tg-theme-hint-color, #999999)' }}>
            Загрузка...
          </p>
        </main>
      </div>
    )
  }

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: 'var(--tg-theme-bg-color, #ffffff)' }}
    >
      <TelegramHeader title="Маршрут" showBack={true} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex justify-between items-center">
          <h1
            className="text-3xl font-bold"
            style={{ color: 'var(--tg-theme-text-color, #000000)' }}
          >
            Маршрут поездки
          </h1>
          <button
            onClick={() => setShowAddDay(!showAddDay)}
            className="px-4 py-2 rounded-lg font-medium transition opacity-90 hover:opacity-100"
            style={{
              backgroundColor: 'var(--tg-theme-button-color, #2481cc)',
              color: 'var(--tg-theme-button-text-color, #ffffff)',
            }}
          >
            + Добавить день
          </button>
        </div>

        {error && (
          <div
            className="rounded-lg p-4 mb-4"
            style={{
              backgroundColor: 'var(--tg-theme-secondary-bg-color, #f1f1f1)',
            }}
          >
            <p style={{ color: '#ef4444' }}>{error}</p>
          </div>
        )}

        {showAddDay && (
          <div
            className="rounded-lg p-4 mb-4"
            style={{
              backgroundColor: 'var(--tg-theme-secondary-bg-color, #f1f1f1)',
            }}
          >
            <div className="flex gap-2">
              <input
                type="date"
                value={newDayDate}
                onChange={(e) => setNewDayDate(e.target.value)}
                min={getMinDate()}
                max={getMaxDate()}
                className="flex-1 px-4 py-2 rounded-lg border"
                style={{
                  backgroundColor: 'var(--tg-theme-bg-color, #ffffff)',
                  color: 'var(--tg-theme-text-color, #000000)',
                  borderColor: 'var(--tg-theme-hint-color, #e5e5e5)',
                }}
              />
              <button
                onClick={handleCreateDay}
                disabled={!newDayDate || creating}
                className="px-4 py-2 rounded-lg font-medium transition opacity-90 hover:opacity-100 disabled:opacity-50"
                style={{
                  backgroundColor: 'var(--tg-theme-button-color, #2481cc)',
                  color: 'var(--tg-theme-button-text-color, #ffffff)',
                }}
              >
                {creating ? 'Создание...' : 'Создать'}
              </button>
              <button
                onClick={() => {
                  setShowAddDay(false)
                  setNewDayDate('')
                }}
                className="px-4 py-2 rounded-lg font-medium transition opacity-90 hover:opacity-100"
                style={{
                  backgroundColor: 'var(--tg-theme-secondary-bg-color, #f1f1f1)',
                  color: 'var(--tg-theme-text-color, #000000)',
                }}
              >
                Отмена
              </button>
            </div>
          </div>
        )}

        {days.length === 0 ? (
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
              Нет запланированных дней
            </p>
            <p
              className="text-sm"
              style={{ color: 'var(--tg-theme-hint-color, #999999)' }}
            >
              Добавьте день, чтобы начать планирование маршрута
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {days.map((day) => (
              <DayCard key={day.id} tripId={tripId} day={day} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

