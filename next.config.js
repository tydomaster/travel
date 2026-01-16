/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.cdn-telegram.org',
      },
      {
        protocol: 'https',
        hostname: '**.telegram.org',
      },
      {
        protocol: 'https',
        hostname: '**.t.me',
      },
    ],
    // Разрешаем любые внешние изображения для аватаров Telegram
    unoptimized: false,
  },
}

module.exports = nextConfig

