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
    
    // Логируем для отладки
    if (initData) {
      try {
        // Пытаемся извлечь user ID из initData для логирования
        const params = new URLSearchParams(initData)
        const userParam = params.get('user')
        if (userParam) {
          const user = JSON.parse(decodeURIComponent(userParam))
          console.log('getInitData: Found initData for user:', {
            id: user.id,
            firstName: user.first_name,
            username: user.username,
            initDataLength: initData.length
          })
        } else {
          console.log('getInitData: Found initData but no user data (length:', initData.length, ')')
        }
      } catch (e) {
        console.log('getInitData: Found initData (length:', initData.length, ') but failed to parse user:', e)
      }
    } else {
      console.warn('getInitData: Telegram WebApp available but initData is empty')
    }
    
    return initData || null
  }
  
  console.warn('getInitData: Telegram WebApp not available. window.Telegram:', typeof window !== 'undefined' ? window.Telegram : 'N/A')
  
  return null
}

