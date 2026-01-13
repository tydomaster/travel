/**
 * Утилиты для работы с Telegram Web App
 */

/**
 * Отправка initData на бэкенд для валидации
 */
export async function validateInitData(initData: string): Promise<{
  valid: boolean
  user?: any
}> {
  try {
    const response = await fetch('/api/telegram/validate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ initData }),
    })

    if (!response.ok) {
      throw new Error('Validation failed')
    }

    return await response.json()
  } catch (error) {
    console.error('Error validating initData:', error)
    return { valid: false }
  }
}

/**
 * Получение initData из Telegram Web App
 */
export function getInitData(): string | null {
  if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
    const initData = window.Telegram.WebApp.initData
    
    // Логируем для отладки (только в dev режиме)
    if (process.env.NODE_ENV === 'development') {
      console.log('getInitData:', initData ? `Found (length: ${initData.length})` : 'Not found')
    }
    
    return initData || null
  }
  
  if (process.env.NODE_ENV === 'development') {
    console.log('getInitData: Telegram WebApp not available')
  }
  
  return null
}

