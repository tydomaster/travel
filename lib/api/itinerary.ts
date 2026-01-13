import { getInitData } from '@/utils/telegram'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export interface Day {
  id: number
  tripId: number
  date: string
  items: Item[]
  createdAt: string
  updatedAt: string
}

export interface Item {
  id: number
  dayId: number
  startTime?: string // Format: "HH:mm"
  durationMinutes?: number
  title: string
  placeId?: number
  notes?: string
  order: number
  createdAt: string
  updatedAt: string
}

export interface CreateDayData {
  date: string
}

export interface CreateItemData {
  startTime?: string
  durationMinutes?: number
  title: string
  placeId?: number
  notes?: string
  order: number
}

export interface UpdateItemData {
  startTime?: string
  durationMinutes?: number
  title: string
  placeId?: number
  notes?: string
  order: number
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

// Days API
export async function getDays(tripId: number): Promise<Day[]> {
  const headers = await getAuthHeaders()
  const response = await fetch(`${API_URL}/api/trips/${tripId}/days`, {
    headers,
  })

  if (!response.ok) {
    throw new Error('Failed to fetch days')
  }

  return response.json()
}

export async function getDay(tripId: number, dayId: number): Promise<Day> {
  const headers = await getAuthHeaders()
  const response = await fetch(`${API_URL}/api/trips/${tripId}/days/${dayId}`, {
    headers,
  })

  if (!response.ok) {
    throw new Error('Failed to fetch day')
  }

  return response.json()
}

export async function createDay(tripId: number, data: CreateDayData): Promise<Day> {
  const headers = await getAuthHeaders()
  const response = await fetch(`${API_URL}/api/trips/${tripId}/days`, {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error('Failed to create day')
  }

  return response.json()
}

export async function deleteDay(tripId: number, dayId: number): Promise<void> {
  const headers = await getAuthHeaders()
  const response = await fetch(`${API_URL}/api/trips/${tripId}/days/${dayId}`, {
    method: 'DELETE',
    headers,
  })

  if (!response.ok) {
    throw new Error('Failed to delete day')
  }
}

// Items API
export async function createItem(
  tripId: number,
  dayId: number,
  data: CreateItemData
): Promise<Item> {
  const headers = await getAuthHeaders()
  const response = await fetch(`${API_URL}/api/trips/${tripId}/days/${dayId}/items`, {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error('Failed to create item')
  }

  return response.json()
}

export async function updateItem(
  tripId: number,
  dayId: number,
  itemId: number,
  data: UpdateItemData
): Promise<Item> {
  const headers = await getAuthHeaders()
  const response = await fetch(
    `${API_URL}/api/trips/${tripId}/days/${dayId}/items/${itemId}`,
    {
      method: 'PUT',
      headers,
      body: JSON.stringify(data),
    }
  )

  if (!response.ok) {
    throw new Error('Failed to update item')
  }

  return response.json()
}

export async function deleteItem(tripId: number, dayId: number, itemId: number): Promise<void> {
  const headers = await getAuthHeaders()
  const response = await fetch(
    `${API_URL}/api/trips/${tripId}/days/${dayId}/items/${itemId}`,
    {
      method: 'DELETE',
      headers,
    }
  )

  if (!response.ok) {
    throw new Error('Failed to delete item')
  }
}

export async function reorderItems(
  tripId: number,
  dayId: number,
  itemIds: number[]
): Promise<void> {
  const headers = await getAuthHeaders()
  const response = await fetch(
    `${API_URL}/api/trips/${tripId}/days/${dayId}/items/reorder`,
    {
      method: 'PUT',
      headers,
      body: JSON.stringify({ itemIds }),
    }
  )

  if (!response.ok) {
    throw new Error('Failed to reorder items')
  }
}

