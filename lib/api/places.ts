import { getInitData } from '@/utils/telegram'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export interface Place {
  id: number
  name: string
  latitude: number
  longitude: number
  address?: string
  description?: string
  createdAt: string
  updatedAt: string
}

export interface CreatePlaceData {
  name: string
  latitude: number
  longitude: number
  address?: string
  description?: string
}

export interface UpdatePlaceData {
  name: string
  latitude: number
  longitude: number
  address?: string
  description?: string
}

async function getAuthHeaders(): Promise<HeadersInit> {
  const initData = getInitData()
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  }

  if (initData) {
    headers['X-Telegram-Init-Data'] = initData
  }

  return headers
}

export async function getPlaces(tripId: number): Promise<Place[]> {
  const headers = await getAuthHeaders()
  const response = await fetch(`${API_URL}/api/trips/${tripId}/places`, {
    headers,
  })

  if (!response.ok) {
    // Если 404 или пустой ответ, возвращаем пустой массив
    if (response.status === 404) {
      return []
    }
    const errorText = await response.text().catch(() => 'Unknown error')
    console.error('Failed to fetch places:', response.status, errorText)
    throw new Error(`Failed to fetch places: ${response.status}`)
  }

  const data = await response.json()
  return Array.isArray(data) ? data : []
}

export async function getPlace(tripId: number, placeId: number): Promise<Place> {
  const headers = await getAuthHeaders()
  const response = await fetch(`${API_URL}/api/trips/${tripId}/places/${placeId}`, {
    headers,
  })

  if (!response.ok) {
    throw new Error('Failed to fetch place')
  }

  return response.json()
}

export async function createPlace(tripId: number, data: CreatePlaceData): Promise<Place> {
  const headers = await getAuthHeaders()
  const response = await fetch(`${API_URL}/api/trips/${tripId}/places`, {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error('Failed to create place')
  }

  return response.json()
}

export async function updatePlace(
  tripId: number,
  placeId: number,
  data: UpdatePlaceData
): Promise<Place> {
  const headers = await getAuthHeaders()
  const response = await fetch(`${API_URL}/api/trips/${tripId}/places/${placeId}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error('Failed to update place')
  }

  return response.json()
}

