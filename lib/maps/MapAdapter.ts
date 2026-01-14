/**
 * Адаптер для работы с картами
 * Позволяет легко переключиться между Leaflet/OSM, Google Maps, Яндекс.Картами
 */

export interface MapMarker {
  id: number | string
  lat: number
  lng: number
  title: string
  data?: any
}

export interface MapAdapter {
  // Инициализация карты
  initMap(containerId: string, center: { lat: number; lng: number }, zoom: number): any

  // Добавление маркера
  addMarker(map: any, marker: MapMarker): any

  // Удаление маркера
  removeMarker(marker: any): void

  // Очистка всех маркеров
  clearMarkers(map: any, markers: any[]): void

  // Установка центра и зума
  setView(map: any, center: { lat: number; lng: number }, zoom: number): void

  // Обработчик клика на карту
  onMapClick(map: any, callback: (lat: number, lng: number) => void): void

  // Обработчик клика на маркер
  onMarkerClick(marker: any, callback: (markerData: MapMarker) => void): void
}

// Leaflet реализация (текущая)
export class LeafletAdapter implements MapAdapter {
  private L: any

  constructor(L: any) {
    this.L = L
  }

  initMap(containerId: string, center: { lat: number; lng: number }, zoom: number): any {
    const map = this.L.map(containerId).setView([center.lat, center.lng], zoom)

    // Добавляем тайлы OpenStreetMap
    this.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map)

    return map
  }

  addMarker(map: any, marker: MapMarker): any {
    const leafletMarker = this.L.marker([marker.lat, marker.lng])
      .addTo(map)
      .bindPopup(marker.title)

    // Сохраняем данные маркера
    ;(leafletMarker as any).markerData = marker

    return leafletMarker
  }

  removeMarker(marker: any): void {
    if (marker && marker.remove) {
      marker.remove()
    }
  }

  clearMarkers(map: any, markers: any[]): void {
    markers.forEach((marker) => this.removeMarker(marker))
  }

  setView(map: any, center: { lat: number; lng: number }, zoom: number): void {
    if (map && map.setView) {
      map.setView([center.lat, center.lng], zoom)
    }
  }

  onMapClick(map: any, callback: (lat: number, lng: number) => void): void {
    if (map && map.on) {
      map.on('click', (e: any) => {
        callback(e.latlng.lat, e.latlng.lng)
      })
    }
  }

  onMarkerClick(marker: any, callback: (markerData: MapMarker) => void): void {
    if (marker && marker.on) {
      marker.on('click', () => {
        const markerData = (marker as any).markerData
        if (markerData) {
          callback(markerData)
        }
      })
    }
  }
}

// Google Maps реализация (для будущего использования)
export class GoogleMapsAdapter implements MapAdapter {
  private google: any

  constructor(google: any) {
    this.google = google
  }

  initMap(containerId: string, center: { lat: number; lng: number }, zoom: number): any {
    return new this.google.maps.Map(document.getElementById(containerId), {
      center: { lat: center.lat, lng: center.lng },
      zoom: zoom,
    })
  }

  addMarker(map: any, marker: MapMarker): any {
    const googleMarker = new this.google.maps.Marker({
      position: { lat: marker.lat, lng: marker.lng },
      map: map,
      title: marker.title,
    })

    ;(googleMarker as any).markerData = marker

    return googleMarker
  }

  removeMarker(marker: any): void {
    if (marker && marker.setMap) {
      marker.setMap(null)
    }
  }

  clearMarkers(map: any, markers: any[]): void {
    markers.forEach((marker) => this.removeMarker(marker))
  }

  setView(map: any, center: { lat: number; lng: number }, zoom: number): void {
    if (map && map.setCenter && map.setZoom) {
      map.setCenter({ lat: center.lat, lng: center.lng })
      map.setZoom(zoom)
    }
  }

  onMapClick(map: any, callback: (lat: number, lng: number) => void): void {
    if (map && this.google.maps.event) {
      this.google.maps.event.addListener(map, 'click', (e: any) => {
        callback(e.latLng.lat(), e.latLng.lng())
      })
    }
  }

  onMarkerClick(marker: any, callback: (markerData: MapMarker) => void): void {
    if (marker && this.google.maps.event) {
      this.google.maps.event.addListener(marker, 'click', () => {
        const markerData = (marker as any).markerData
        if (markerData) {
          callback(markerData)
        }
      })
    }
  }
}

// Фабрика для создания адаптера
export function createMapAdapter(type: 'leaflet' | 'google' = 'leaflet', lib?: any): MapAdapter {
  switch (type) {
    case 'leaflet':
      return new LeafletAdapter(lib)
    case 'google':
      if (!lib) {
        throw new Error('Google Maps library is required')
      }
      return new GoogleMapsAdapter(lib)
    default:
      throw new Error(`Unknown map adapter type: ${type}`)
  }
}

