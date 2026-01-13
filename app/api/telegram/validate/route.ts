import { NextRequest, NextResponse } from 'next/server'

/**
 * Валидация initData от Telegram Web App
 * 
 * В production здесь должна быть реальная валидация с использованием секретного ключа бота.
 * См. документацию: https://core.telegram.org/bots/webapps#validating-data-received-via-the-mini-app
 */
export async function POST(request: NextRequest) {
  try {
    const { initData } = await request.json()

    if (!initData) {
      return NextResponse.json(
        { error: 'initData is required' },
        { status: 400 }
      )
    }

    // TODO: Реальная валидация initData
    // 1. Парсим initData (строка вида "query_id=...&user=...&auth_date=...&hash=...")
    // 2. Извлекаем hash
    // 3. Создаем data-check-string из всех параметров кроме hash
    // 4. Вычисляем секретный ключ: HMAC-SHA256(data-check-string, secret_key)
    // 5. Сравниваем с полученным hash
    
    // Заглушка для разработки
    const isValid = process.env.NODE_ENV === 'development' || validateInitData(initData)

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid initData' },
        { status: 401 }
      )
    }

    // Парсим данные пользователя из initData
    const userData = parseInitData(initData)

    return NextResponse.json({
      valid: true,
      user: userData,
    })
  } catch (error) {
    console.error('Error validating initData:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * Заглушка для валидации initData
 * В production должна быть реальная валидация
 */
function validateInitData(initData: string): boolean {
  // В dev режиме всегда возвращаем true
  if (process.env.NODE_ENV === 'development') {
    return true
  }

  // TODO: Реализовать реальную валидацию
  // const secretKey = process.env.TELEGRAM_BOT_SECRET_KEY
  // if (!secretKey) {
  //   return false
  // }
  
  // Парсинг и валидация hash
  // ...
  
  return false
}

/**
 * Парсинг данных пользователя из initData
 */
function parseInitData(initData: string): any {
  const params = new URLSearchParams(initData)
  const userParam = params.get('user')
  
  if (userParam) {
    try {
      return JSON.parse(decodeURIComponent(userParam))
    } catch {
      return null
    }
  }
  
  return null
}

