import { getInitData } from '@/utils/telegram'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export interface Trip {
  id: number
  title: string
  startDate?: string
  endDate?: string
  ownerId: number
  ownerName: string
  role: MembershipRole
  createdAt: string
  updatedAt: string
  members: Member[]
}

export interface Member {
  userId: number
  name: string
  avatar?: string
  role: MembershipRole
}

export enum MembershipRole {
  Owner = 1,
  Editor = 2,
  Viewer = 3,
}

export interface CreateTripData {
  title: string
  startDate?: string
  endDate?: string
}

export interface InviteResponse {
  token: string
  expiresAt: string
}

async function getAuthHeaders(): Promise<HeadersInit> {
  const initData = getInitData()
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  }

  // В dev режиме initData может быть null, но API должен работать с мок-данными
  if (initData) {
    headers['X-Telegram-Init-Data'] = initData
  }
  // Если initData нет, API в dev режиме использует мок-пользователя

  return headers
}

export async function getMyTrips(): Promise<Trip[]> {
  try {
    const headers = await getAuthHeaders()
    const initData = getInitData()
    
    // Логируем для отладки (только в dev режиме)
    if (process.env.NODE_ENV === 'development') {
      console.log('Fetching trips with initData:', initData ? 'present' : 'missing')
    }
    
    const url = `${API_URL}/api/trips`
    
    // Логируем для отладки
    if (process.env.NODE_ENV === 'development') {
      console.log('API Request URL:', url)
      console.log('API_URL from env:', process.env.NEXT_PUBLIC_API_URL)
    }
    
    const response = await fetch(url, {
      headers,
    })

    if (!response.ok) {
      let errorMessage = `Ошибка загрузки поездок: ${response.status}`
      
      if (response.status === 401) {
        errorMessage = 'Не удалось авторизоваться. Убедитесь, что вы открыли приложение через Telegram Mini App.'
      } else {
        try {
          const errorData = await response.json()
          if (errorData.message) {
            errorMessage = errorData.message
          } else if (errorData.error) {
            errorMessage = errorData.error
          }
        } catch {
          const errorText = await response.text().catch(() => '')
          if (errorText) {
            errorMessage = errorText
          }
        }
      }
      
      throw new Error(errorMessage)
    }

    return response.json()
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error(`Не удалось подключиться к серверу. Убедитесь, что бэкенд запущен на ${API_URL}`)
    }
    throw error
  }
}

export async function getTrip(id: number): Promise<Trip> {
  const headers = await getAuthHeaders()
  const response = await fetch(`${API_URL}/api/trips/${id}`, {
    headers,
  })

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Trip not found')
    }
    throw new Error('Failed to fetch trip')
  }

  return response.json()
}

export async function createTrip(data: CreateTripData): Promise<Trip> {
  const headers = await getAuthHeaders()
  const url = `${API_URL}/api/trips`
  
  // Логируем для отладки
  if (process.env.NODE_ENV === 'development') {
    console.log('Create Trip API URL:', url)
  }
  
  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    let errorMessage = `Ошибка создания поездки: ${response.status}`
    try {
      const errorData = await response.json()
      if (errorData.message) {
        errorMessage = errorData.message
      } else if (errorData.error) {
        errorMessage = errorData.error
      }
    } catch {
      const errorText = await response.text().catch(() => '')
      if (errorText) {
        errorMessage = errorText
      }
    }
    throw new Error(errorMessage)
  }

  return response.json()
}

export async function createInvite(tripId: number, expiresAt?: string): Promise<InviteResponse> {
  const headers = await getAuthHeaders()
  const response = await fetch(`${API_URL}/api/invites`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      tripId,
      expiresAt,
    }),
  })

  if (!response.ok) {
    throw new Error('Failed to create invite')
  }

  return response.json()
}

export async function joinTrip(token: string): Promise<Trip> {
  const headers = await getAuthHeaders()
  const response = await fetch(`${API_URL}/api/invites/join`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ token }),
  })

  if (!response.ok) {
    throw new Error('Failed to join trip')
  }

  return response.json()
}

