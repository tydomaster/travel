'use client'

import { useEffect, useRef, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import { Place } from '@/lib/api/places'
import PlaceCard from './PlaceCard'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Исправляем иконки маркеров для Leaflet
const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

L.Marker.prototype.options.icon = defaultIcon

interface PlacesMapProps {
  places: Place[]
  selectedPlace?: Place | null
  onPlaceSelect: (place: Place | null) => void
  isPlaceInDay: (place: Place) => boolean
  onTogglePlaceInDay: (place: Place) => void
}

// Компонент для обновления границ карты
function MapBoundsUpdater({
  places,
}: {
  places: Place[]
}) {
  const map = useMap()

  useEffect(() => {
    if (places.length > 0) {
      const bounds = L.latLngBounds(
        places.map((p) => [p.latitude, p.longitude] as [number, number])
      )
      map.fitBounds(bounds, { padding: [50, 50] })
    }
  }, [places, map])

  return null
}

export default function PlacesMap({
  places,
  selectedPlace,
  onPlaceSelect,
  isPlaceInDay,
  onTogglePlaceInDay,
}: PlacesMapProps) {
  const [mapCenter, setMapCenter] = useState<[number, number]>([55.7558, 37.6173]) // Москва по умолчанию
  const [mapZoom, setMapZoom] = useState(10)

  useEffect(() => {
    if (places.length > 0) {
      // Вычисляем центр всех мест
      const avgLat = places.reduce((sum, p) => sum + p.latitude, 0) / places.length
      const avgLng = places.reduce((sum, p) => sum + p.longitude, 0) / places.length
      setMapCenter([avgLat, avgLng])
    }
  }, [places])

  if (places.length === 0) {
    return (
      <div
        className="h-96 w-full rounded-lg flex items-center justify-center"
        style={{
          backgroundColor: 'var(--tg-theme-secondary-bg-color, #f1f1f1)',
        }}
      >
        <p style={{ color: 'var(--tg-theme-hint-color, #999999)' }}>
          Нет мест для отображения
        </p>
      </div>
    )
  }

  return (
    <div className="relative h-96 w-full rounded-lg overflow-hidden">
      <MapContainer
        center={mapCenter}
        zoom={mapZoom}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapBoundsUpdater places={places} />
        {places.map((place) => (
          <Marker
            key={place.id}
            position={[place.latitude, place.longitude]}
            eventHandlers={{
              click: () => {
                onPlaceSelect(place)
              },
            }}
          >
            <Popup>
              <div>
                <strong>{place.name}</strong>
                {place.address && <div className="text-sm text-gray-600">{place.address}</div>}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {selectedPlace && (
        <PlaceCard
          place={selectedPlace}
          isInDay={isPlaceInDay(selectedPlace)}
          onToggleDay={(place) => {
            onTogglePlaceInDay(place)
            onPlaceSelect(null)
          }}
          onClose={() => onPlaceSelect(null)}
        />
      )}
    </div>
  )
}

