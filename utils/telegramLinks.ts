/**
 * Утилиты для создания Telegram Mini App ссылок
 */

/**
 * Создает deep link для открытия Telegram Mini App с параметром startapp
 * Формат: https://t.me/bot_username/app_name?startapp=token
 */
export function createTelegramMiniAppLink(
  botUsername: string,
  appName: string,
  token: string
): string {
  // Убираем @ если есть
  const cleanUsername = botUsername.replace('@', '')
  return `https://t.me/${cleanUsername}/${appName}?startapp=${token}`
}

/**
 * Получает start_param из initData (если Mini App открыт через deep link)
 */
export function getStartParam(): string | null {
  if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
    return window.Telegram.WebApp.initDataUnsafe.start_param || null
  }
  return null
}

