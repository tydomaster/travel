'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import TelegramHeader from '@/components/TelegramHeader'
import { createTrip } from '@/lib/api/trips'

export default function CreateTripPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    startDate: '',
    endDate: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const trip = await createTrip({
        title: formData.title,
        startDate: formData.startDate || undefined,
        endDate: formData.endDate || undefined,
      })
      router.push(`/trips/${trip.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка создания поездки')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: 'var(--tg-theme-bg-color, #ffffff)' }}
    >
      <TelegramHeader title="Создать поездку" showBack={true} />
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium mb-2"
              style={{ color: 'var(--tg-theme-text-color, #000000)' }}
            >
              Название поездки *
            </label>
            <input
              type="text"
              id="title"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border"
              style={{
                backgroundColor: 'var(--tg-theme-secondary-bg-color, #f1f1f1)',
                color: 'var(--tg-theme-text-color, #000000)',
                borderColor: 'var(--tg-theme-hint-color, #e5e5e5)',
              }}
              placeholder="Например: Поездка в Париж"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="startDate"
                className="block text-sm font-medium mb-2"
                style={{ color: 'var(--tg-theme-text-color, #000000)' }}
              >
                Дата начала
              </label>
              <input
                type="date"
                id="startDate"
                value={formData.startDate}
                onChange={(e) =>
                  setFormData({ ...formData, startDate: e.target.value })
                }
                className="w-full px-4 py-2 rounded-lg border"
                style={{
                  backgroundColor: 'var(--tg-theme-secondary-bg-color, #f1f1f1)',
                  color: 'var(--tg-theme-text-color, #000000)',
                  borderColor: 'var(--tg-theme-hint-color, #e5e5e5)',
                }}
              />
            </div>

            <div>
              <label
                htmlFor="endDate"
                className="block text-sm font-medium mb-2"
                style={{ color: 'var(--tg-theme-text-color, #000000)' }}
              >
                Дата окончания
              </label>
              <input
                type="date"
                id="endDate"
                value={formData.endDate}
                onChange={(e) =>
                  setFormData({ ...formData, endDate: e.target.value })
                }
                min={formData.startDate}
                className="w-full px-4 py-2 rounded-lg border"
                style={{
                  backgroundColor: 'var(--tg-theme-secondary-bg-color, #f1f1f1)',
                  color: 'var(--tg-theme-text-color, #000000)',
                  borderColor: 'var(--tg-theme-hint-color, #e5e5e5)',
                }}
              />
            </div>
          </div>

          {error && (
            <div
              className="rounded-lg p-4"
              style={{
                backgroundColor: 'var(--tg-theme-secondary-bg-color, #f1f1f1)',
              }}
            >
              <p style={{ color: '#ef4444' }}>{error}</p>
            </div>
          )}

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 px-4 py-3 rounded-lg font-medium transition opacity-90 hover:opacity-100"
              style={{
                backgroundColor: 'var(--tg-theme-secondary-bg-color, #f1f1f1)',
                color: 'var(--tg-theme-text-color, #000000)',
              }}
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={loading || !formData.title.trim()}
              className="flex-1 px-4 py-3 rounded-lg font-medium transition opacity-90 hover:opacity-100 disabled:opacity-50"
              style={{
                backgroundColor: 'var(--tg-theme-button-color, #2481cc)',
                color: 'var(--tg-theme-button-text-color, #ffffff)',
              }}
            >
              {loading ? 'Создание...' : 'Создать поездку'}
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}

