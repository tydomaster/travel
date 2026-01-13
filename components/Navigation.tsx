'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTelegram } from '@/hooks/useTelegram'

export default function Navigation() {
  const pathname = usePathname()
  const { isDevMode } = useTelegram()

  const isActive = (path: string) => {
    return pathname?.startsWith(path)
  }

  // В Telegram MiniApp навигация может быть скрыта или упрощена
  // Показываем только на главной странице или в dev режиме
  if (pathname !== '/' && !isDevMode) {
    return null
  }

  return (
    <nav
      className="border-b"
      style={{
        backgroundColor: 'var(--tg-theme-secondary-bg-color, #f1f1f1)',
        borderColor: 'var(--tg-theme-hint-color, #e5e5e5)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link
              href="/"
              className="text-xl font-semibold"
              style={{ color: 'var(--tg-theme-text-color, #000000)' }}
            >
              Travel Planner
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              href="/trips"
              className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                isActive('/trips')
                  ? 'opacity-80'
                  : 'opacity-60 hover:opacity-100'
              }`}
              style={{ color: 'var(--tg-theme-link-color, #2481cc)' }}
            >
              Мои поездки
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

