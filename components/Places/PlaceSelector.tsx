'use client'

import { useState } from 'react'
import { MockPlace, MOCK_PLACES, getCities, getCategories } from '@/lib/mocks/places'
import { useTelegram } from '@/hooks/useTelegram'

interface PlaceSelectorProps {
  onSelect: (place: MockPlace) => void
  onClose: () => void
}

export default function PlaceSelector({ onSelect, onClose }: PlaceSelectorProps) {
  const { webApp } = useTelegram()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCity, setSelectedCity] = useState<string>('')
  const [selectedCategory, setSelectedCategory] = useState<MockPlace['category'] | ''>('')

  const cities = getCities()
  const categories = getCategories()

  const filteredPlaces = MOCK_PLACES.filter((place) => {
    const matchesSearch =
      searchQuery === '' ||
      place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      place.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      place.city.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCity = selectedCity === '' || place.city === selectedCity
    const matchesCategory = selectedCategory === '' || place.category === selectedCategory

    return matchesSearch && matchesCity && matchesCategory
  })

  const handleSelect = (place: MockPlace) => {
    onSelect(place)
    if (webApp?.HapticFeedback) {
      webApp.HapticFeedback.notificationOccurred('success')
    }
  }

  const getCategoryName = (category: MockPlace['category']) => {
    const names: Record<MockPlace['category'], string> = {
      attraction: 'Достопримечательность',
      restaurant: 'Ресторан',
      hotel: 'Отель',
      museum: 'Музей',
      park: 'Парк',
      shopping: 'Шоппинг',
    }
    return names[category]
  }

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col"
      style={{ backgroundColor: 'var(--tg-theme-bg-color, #ffffff)' }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between border-b p-4"
        style={{
          borderColor: 'var(--tg-theme-hint-color, #e5e5e5)',
        }}
      >
        <h2
          className="text-xl font-semibold"
          style={{ color: 'var(--tg-theme-text-color, #000000)' }}
        >
          Выберите место
        </h2>
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

      {/* Filters */}
      <div className="border-b p-4 space-y-3" style={{ borderColor: 'var(--tg-theme-hint-color, #e5e5e5)' }}>
        <input
          type="text"
          placeholder="Поиск по названию, адресу..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-lg border px-4 py-2"
          style={{
            backgroundColor: 'var(--tg-theme-bg-color, #ffffff)',
            color: 'var(--tg-theme-text-color, #000000)',
            borderColor: 'var(--tg-theme-hint-color, #e5e5e5)',
          }}
        />
        <div className="flex gap-2">
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="flex-1 rounded-lg border px-3 py-2 text-sm"
            style={{
              backgroundColor: 'var(--tg-theme-bg-color, #ffffff)',
              color: 'var(--tg-theme-text-color, #000000)',
              borderColor: 'var(--tg-theme-hint-color, #e5e5e5)',
            }}
          >
            <option value="">Все города</option>
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as MockPlace['category'] | '')}
            className="flex-1 rounded-lg border px-3 py-2 text-sm"
            style={{
              backgroundColor: 'var(--tg-theme-bg-color, #ffffff)',
              color: 'var(--tg-theme-text-color, #000000)',
              borderColor: 'var(--tg-theme-hint-color, #e5e5e5)',
            }}
          >
            <option value="">Все категории</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {getCategoryName(category)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Places List */}
      <div className="flex-1 overflow-y-auto p-4">
        {filteredPlaces.length === 0 ? (
          <div className="text-center py-8">
            <p style={{ color: 'var(--tg-theme-hint-color, #999999)' }}>
              Места не найдены
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredPlaces.map((place) => (
              <button
                key={place.id}
                onClick={() => handleSelect(place)}
                className="w-full rounded-lg border p-4 text-left transition hover:opacity-80"
                style={{
                  backgroundColor: 'var(--tg-theme-secondary-bg-color, #f1f1f1)',
                  borderColor: 'var(--tg-theme-hint-color, #e5e5e5)',
                }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3
                      className="font-medium"
                      style={{ color: 'var(--tg-theme-text-color, #000000)' }}
                    >
                      {place.name}
                    </h3>
                    <p
                      className="mt-1 text-sm"
                      style={{ color: 'var(--tg-theme-hint-color, #999999)' }}
                    >
                      {place.address}
                    </p>
                    <div className="mt-2 flex gap-2">
                      <span
                        className="rounded px-2 py-1 text-xs"
                        style={{
                          backgroundColor: 'var(--tg-theme-button-color, #2481cc)',
                          color: 'var(--tg-theme-button-text-color, #ffffff)',
                        }}
                      >
                        {place.city}
                      </span>
                      <span
                        className="rounded px-2 py-1 text-xs"
                        style={{
                          backgroundColor: 'var(--tg-theme-secondary-bg-color, #f1f1f1)',
                          color: 'var(--tg-theme-hint-color, #999999)',
                        }}
                      >
                        {getCategoryName(place.category)}
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

