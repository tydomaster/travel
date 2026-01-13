'use client'

import Link from 'next/link'
import { Day } from '@/lib/api/itinerary'

interface DayCardProps {
  tripId: number
  day: Day
}

export default function DayCard({ tripId, day }: DayCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ru-RU', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    })
  }

  const itemsCount = day.items.length
  const hasItems = itemsCount > 0

  return (
    <Link
      href={`/trips/${tripId}/itinerary/${day.id}`}
      className="block rounded-lg p-4 transition opacity-90 hover:opacity-100"
      style={{
        backgroundColor: 'var(--tg-theme-secondary-bg-color, #f1f1f1)',
      }}
    >
      <div className="flex justify-between items-start mb-2">
        <h3
          className="text-lg font-semibold"
          style={{ color: 'var(--tg-theme-text-color, #000000)' }}
        >
          {formatDate(day.date)}
        </h3>
        <span
          className="text-sm px-2 py-1 rounded"
          style={{
            backgroundColor: hasItems
              ? 'var(--tg-theme-button-color, #2481cc)'
              : 'var(--tg-theme-hint-color, #999999)',
            color: 'var(--tg-theme-button-text-color, #ffffff)',
          }}
        >
          {itemsCount} {itemsCount === 1 ? 'пункт' : itemsCount < 5 ? 'пункта' : 'пунктов'}
        </span>
      </div>
      {hasItems && (
        <div className="space-y-1">
          {day.items.slice(0, 3).map((item) => (
            <div
              key={item.id}
              className="text-sm flex items-center gap-2"
              style={{ color: 'var(--tg-theme-hint-color, #999999)' }}
            >
              {item.startTime && (
                <span className="font-mono">{item.startTime}</span>
              )}
              <span className="truncate">{item.title}</span>
            </div>
          ))}
          {itemsCount > 3 && (
            <p
              className="text-xs"
              style={{ color: 'var(--tg-theme-hint-color, #999999)' }}
            >
              +{itemsCount - 3} еще
            </p>
          )}
        </div>
      )}
      {!hasItems && (
        <p
          className="text-sm italic"
          style={{ color: 'var(--tg-theme-hint-color, #999999)' }}
        >
          Нет запланированных пунктов
        </p>
      )}
    </Link>
  )
}

