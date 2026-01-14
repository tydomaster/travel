'use client'

import { Place } from '@/lib/api/places'
import { useTelegram } from '@/hooks/useTelegram'

interface PlaceCardProps {
  place: Place
  isInDay: boolean
  onToggleDay: (place: Place) => void
  onClose: () => void
}

export default function PlaceCard({ place, isInDay, onToggleDay, onClose }: PlaceCardProps) {
  const { webApp } = useTelegram()

  const handleToggle = () => {
    onToggleDay(place)
    if (webApp?.HapticFeedback) {
      webApp.HapticFeedback.notificationOccurred('success')
    }
  }

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 rounded-t-lg p-6 shadow-lg"
      style={{
        backgroundColor: 'var(--tg-theme-bg-color, #ffffff)',
        maxHeight: '60vh',
        overflowY: 'auto',
      }}
    >
      <div className="mb-4 flex items-center justify-between">
        <h3
          className="text-xl font-semibold"
          style={{ color: 'var(--tg-theme-text-color, #000000)' }}
        >
          {place.name}
        </h3>
        <button
          onClick={onClose}
          className="rounded-full p-2 transition hover:opacity-70"
          style={{
            backgroundColor: 'var(--tg-theme-secondary-bg-color, #f1f1f1)',
          }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            style={{ color: 'var(--tg-theme-text-color, #000000)' }}
          >
            <path
              d="M15 5L5 15M5 5l10 10"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      {place.address && (
        <p
          className="mb-2 text-sm"
          style={{ color: 'var(--tg-theme-hint-color, #999999)' }}
        >
          📍 {place.address}
        </p>
      )}

      {place.description && (
        <p
          className="mb-4 text-sm"
          style={{ color: 'var(--tg-theme-text-color, #000000)' }}
        >
          {place.description}
        </p>
      )}

      <div className="mb-4 text-xs" style={{ color: 'var(--tg-theme-hint-color, #999999)' }}>
        Координаты: {place.latitude.toFixed(6)}, {place.longitude.toFixed(6)}
      </div>

      <button
        onClick={handleToggle}
        className="w-full rounded-lg px-4 py-3 font-medium transition opacity-90 hover:opacity-100"
        style={{
          backgroundColor: isInDay
            ? 'var(--tg-theme-destructive-text-color, #ef4444)'
            : 'var(--tg-theme-button-color, #2481cc)',
          color: 'var(--tg-theme-button-text-color, #ffffff)',
        }}
      >
        {isInDay ? 'Убрать из дня' : 'Добавить в день'}
      </button>
    </div>
  )
}

