import type { Metadata, Viewport } from 'next'
import './globals.css'
import TelegramProvider from '@/components/TelegramProvider'

export const metadata: Metadata = {
  title: 'Travel Planner - Планировщик групповых поездок',
  description: 'Планируйте групповые поездки вместе с друзьями',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
      </head>
      <body>
        <TelegramProvider>{children}</TelegramProvider>
      </body>
    </html>
  )
}

