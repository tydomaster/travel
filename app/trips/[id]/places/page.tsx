'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import TelegramHeader from '@/components/TelegramHeader'
import PlacesMap from '@/components/Places/PlacesMap'
import { getPlaces, Place } from '@/lib/api/places'
import { getDays, Day, createItem, deleteItem } from '@/lib/api/itinerary'
import { getTrip, MembershipRole } from '@/lib/api/trips'
import { useTelegram } from '@/hooks/useTelegram'

export default function PlacesPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { webApp } = useTelegram()
  const tripId = Number(params.id)
  const [places, setPlaces] = useState<Place[]>([])
  const [days, setDays] = useState<Day[]>([])
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedDayId, setSelectedDayId] = useState<number | null>(null)

  useEffect(() => {
    loadData()
  }, [tripId])

  const loadData = async () => {
    try {
      setLoading(true)
      const [placesData, daysData] = await Promise.all([
        getPlaces(tripId),
        getDays(tripId),
      ])
      setPlaces(placesData)
      setDays(daysData)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки мест')
    } finally {
      setLoading(false)
    }
  }

  // Проверяем, находится ли место в выбранном дне
  const isPlaceInDay = (place: Place): boolean => {
    if (!selectedDayId) return false
    const day = days.find((d) => d.id === selectedDayId)
    if (!day) return false
    return day.items.some((item) => item.placeId === place.id)
  }

  const handleTogglePlaceInDay = async (place: Place) => {
    if (!selectedDayId) {
      // Если день не выбран, показываем список дней для выбора
      alert('Выберите день из списка выше')
      return
    }

    const day = days.find((d) => d.id === selectedDayId)
    if (!day) return

    const isInDay = isPlaceInDay(place)

    try {
      if (isInDay) {
        // Удаляем место из дня (находим item с этим placeId и удаляем его)
        const item = day.items.find((i) => i.placeId === place.id)
        if (item) {
          await deleteItem(tripId, selectedDayId, item.id)
        }
      } else {
        // Добавляем место в день (создаем новый item)
        await createItem(tripId, selectedDayId, {
          title: place.name,
          placeId: place.id,
          order: day.items.length,
        })
      }

      // Перезагружаем данные
      await loadData()
      setSelectedPlace(null)

      if (webApp?.HapticFeedback) {
        webApp.HapticFeedback.notificationOccurred('success')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка обновления дня')
      if (webApp?.HapticFeedback) {
        webApp.HapticFeedback.notificationOccurred('error')
      }
    }
  }

  if (loading) {
    return (
      <div
        className="min-h-screen"
        style={{ backgroundColor: 'var(--tg-theme-bg-color, #ffffff)' }}
      >
        <TelegramHeader title="Места" showBack={true} />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p style={{ color: 'var(--tg-theme-hint-color, #999999)' }}>Загрузка...</p>
        </main>
      </div>
    )
  }

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: 'var(--tg-theme-bg-color, #ffffff)' }}
    >
      <TelegramHeader title="Места" showBack={true} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

        {/* Выбор дня */}
        {days.length > 0 && (
          <div className="mb-4">
            <label
              className="mb-2 block text-sm font-medium"
              style={{ color: 'var(--tg-theme-text-color, #000000)' }}
            >
              Выберите день для добавления/удаления мест:
            </label>
            <select
              value={selectedDayId || ''}
              onChange={(e) => setSelectedDayId(Number(e.target.value) || null)}
              className="w-full rounded-lg border px-4 py-2"
              style={{
                backgroundColor: 'var(--tg-theme-bg-color, #ffffff)',
                color: 'var(--tg-theme-text-color, #000000)',
                borderColor: 'var(--tg-theme-hint-color, #e5e5e5)',
              }}
            >
              <option value="">-- Выберите день --</option>
              {days.map((day) => (
                <option key={day.id} value={day.id}>
                  {new Date(day.date).toLocaleDateString('ru-RU', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Карта */}
        <div className="mb-4">
          <PlacesMap
            places={places}
            selectedPlace={selectedPlace}
            onPlaceSelect={setSelectedPlace}
            isPlaceInDay={isPlaceInDay}
            onTogglePlaceInDay={handleTogglePlaceInDay}
          />
        </div>

        {/* Список мест */}
        {places.length === 0 ? (
          <div
            className="rounded-lg p-8 text-center"
            style={{
              backgroundColor: 'var(--tg-theme-secondary-bg-color, #f1f1f1)',
            }}
          >
            <p style={{ color: 'var(--tg-theme-hint-color, #999999)' }}>
              Нет мест в маршруте
            </p>
            <p className="mt-2 text-sm" style={{ color: 'var(--tg-theme-hint-color, #999999)' }}>
              Добавьте места в дни маршрута, чтобы они отображались здесь
            </p>
          </div>
        ) : (
          <div>
            <h2
              className="mb-4 text-xl font-semibold"
              style={{ color: 'var(--tg-theme-text-color, #000000)' }}
            >
              Все места ({places.length})
            </h2>
            <div className="space-y-2">
              {places.map((place) => (
                <div
                  key={place.id}
                  onClick={() => setSelectedPlace(place)}
                  className="cursor-pointer rounded-lg p-4 transition hover:opacity-80"
                  style={{
                    backgroundColor: 'var(--tg-theme-secondary-bg-color, #f1f1f1)',
                  }}
                >
                  <h3
                    className="font-medium"
                    style={{ color: 'var(--tg-theme-text-color, #000000)' }}
                  >
                    {place.name}
                  </h3>
                  {place.address && (
                    <p
                      className="mt-1 text-sm"
                      style={{ color: 'var(--tg-theme-hint-color, #999999)' }}
                    >
                      {place.address}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
