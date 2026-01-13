# Travel Planner - Планировщик групповых поездок

Telegram MiniApp для планирования групповых поездок.

## Технологический стек

- **Фронтенд**: Next.js 14, React, TypeScript, Tailwind CSS
- **Бэкенд**: .NET 8, C#
- **Роутинг**: Next.js App Router

## Структура проекта

```
.
├── app/                    # Next.js App Router
│   ├── trips/             # Роуты для поездок
│   │   ├── [id]/          # Детали поездки
│   │   │   ├── itinerary/ # Маршрут
│   │   │   ├── places/    # Места
│   │   │   ├── lists/     # Списки
│   │   │   ├── flights/   # Рейсы
│   │   │   └── assistant/ # AI Ассистент
│   │   └── create/        # Создание поездки
│   └── page.tsx           # Главная страница
├── components/             # React компоненты
├── backend/               # .NET API
│   └── TravelPlanner.Api/
└── package.json
```

## Как запустить локально

### Предварительные требования

- Node.js 18+ и npm
- .NET 8 SDK

### Фронтенд

1. Установите зависимости:
```bash
npm install
```

2. (Опционально) Создайте файл `.env.local` для переменных окружения:
```bash
# API
NEXT_PUBLIC_API_URL=http://localhost:5000

# Telegram Bot (для создания ссылок-приглашений)
NEXT_PUBLIC_TELEGRAM_BOT_USERNAME=your_bot_username
NEXT_PUBLIC_TELEGRAM_APP_NAME=travel-planner
```

**Важно:** `NEXT_PUBLIC_TELEGRAM_BOT_USERNAME` и `NEXT_PUBLIC_TELEGRAM_APP_NAME` нужны для создания ссылок-приглашений, которые открывают Telegram Mini App.

3. Запустите dev-сервер:
```bash
npm run dev
```

Приложение будет доступно по адресу [http://localhost:3000](http://localhost:3000)

### Бэкенд

1. Перейдите в директорию бэкенда:
```bash
cd backend/TravelPlanner.Api
```

2. Восстановите зависимости:
```bash
dotnet restore
```

3. Запустите API:
```bash
dotnet run
```

API будет доступен по адресу [http://localhost:5000](http://localhost:5000)

Swagger UI доступен по адресу [http://localhost:5000/swagger](http://localhost:5000/swagger)

## Доступные команды

### Фронтенд

- `npm run dev` - запуск dev-сервера
- `npm run build` - сборка для production
- `npm run start` - запуск production-сборки
- `npm run lint` - проверка кода линтером
- `npm run format` - форматирование кода с помощью Prettier

### Бэкенд

- `dotnet run` - запуск API
- `dotnet build` - сборка проекта
- `dotnet test` - запуск тестов (если будут добавлены)

## Роутинг

Приложение использует следующие основные роуты:

- `/` - главная страница
- `/trips` - список поездок
- `/trips/create` - создание новой поездки
- `/trips/[id]` - обзор поездки
- `/trips/[id]/itinerary` - маршрут поездки
- `/trips/[id]/places` - места для посещения
- `/trips/[id]/lists` - списки (вещи, дела, покупки)
- `/trips/[id]/flights` - управление рейсами
- `/trips/[id]/assistant` - AI ассистент

## Разработка

### Линтеры и форматеры

- **ESLint** - проверка кода (конфигурация Next.js)
- **Prettier** - форматирование кода с поддержкой Tailwind CSS

### Стилизация

Проект использует Tailwind CSS для стилизации. Конфигурация находится в `tailwind.config.ts`.

## Интеграция с Telegram Web Apps

Приложение интегрировано с Telegram Web Apps SDK и поддерживает:

- ✅ Инициализация Telegram Web App
- ✅ Получение и валидация initData
- ✅ Автоматическое применение темы Telegram (цвета, фон)
- ✅ Корректный viewport для мобильных устройств
- ✅ Кнопка "Back" через Telegram API
- ✅ Dev-режим для разработки вне Telegram

### Компоненты Telegram

- `TelegramProvider` - провайдер для инициализации Telegram SDK
- `TelegramHeader` - компонент для управления кнопкой Back
- `useTelegram` - хук для доступа к Telegram Web App API
- `useInitData` - хук для валидации initData

### Как протестировать локально

#### Вариант 1: Dev-режим (без Telegram)

1. Запустите приложение:
```bash
npm run dev
```

2. Откройте браузер по адресу `http://localhost:3000`

3. Приложение автоматически определит, что оно запущено не в Telegram, и переключится в dev-режим:
   - Показывается предупреждение о dev-режиме
   - Используются мок-данные пользователя
   - Кнопка "Back" отображается как обычная HTML-кнопка

#### Вариант 2: Через ngrok (для тестирования в Telegram)

1. Установите [ngrok](https://ngrok.com/):
```bash
# Windows (через Chocolatey)
choco install ngrok

# Или скачайте с https://ngrok.com/download
```

2. Запустите локальный сервер:
```bash
npm run dev
```

3. В другом терминале запустите ngrok:
```bash
ngrok http 3000
```

4. Скопируйте HTTPS URL из ngrok (например, `https://abc123.ngrok.io`)

5. Создайте бота через [@BotFather](https://t.me/botfather) в Telegram:
   - Отправьте `/newbot`
   - Следуйте инструкциям для создания бота
   - Сохраните токен бота

6. Настройте Web App для бота:
   - Отправьте `/newapp` в @BotFather
   - Выберите вашего бота
   - Укажите название и описание
   - Укажите URL: `https://abc123.ngrok.io` (ваш ngrok URL)
   - Загрузите иконку (опционально)

7. Откройте бота в Telegram и запустите Mini App

#### Вариант 3: Через локальный туннель (альтернатива ngrok)

1. Установите [localtunnel](https://localtunnel.github.io/www/):
```bash
npm install -g localtunnel
```

2. Запустите локальный сервер:
```bash
npm run dev
```

3. В другом терминале запустите туннель:
```bash
lt --port 3000
```

4. Используйте полученный URL для настройки Web App в @BotFather

### Валидация initData

Валидация initData реализована через API endpoint `/api/telegram/validate`.

**Важно**: В production необходимо реализовать реальную валидацию с использованием секретного ключа бота. См. [документацию Telegram](https://core.telegram.org/bots/webapps#validating-data-received-via-the-mini-app).

Текущая реализация:
- В dev-режиме валидация всегда проходит успешно
- В production требуется реализовать проверку HMAC-SHA256

### Переменные окружения

Добавьте в `.env`:

```env
# Telegram Bot
TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_BOT_USERNAME=your_bot_username

# Для валидации initData (production)
TELEGRAM_BOT_SECRET_KEY=your_secret_key_here
```

### Структура Telegram компонентов

```
hooks/
  ├── useTelegram.ts      # Основной хук для работы с Telegram API
  └── useInitData.ts      # Хук для валидации initData

components/
  ├── TelegramProvider.tsx  # Провайдер для инициализации
  └── TelegramHeader.tsx    # Компонент для кнопки Back

utils/
  └── telegram.ts           # Утилиты для работы с Telegram

app/api/telegram/
  └── validate/
      └── route.ts          # API endpoint для валидации
```

## Документация

- [API Документация](./backend/API_DOCUMENTATION.md) - Полное описание API endpoints
- [Миграции базы данных](./backend/MIGRATIONS.md) - Управление миграциями
- [Тестирование Telegram](./TELEGRAM_TESTING.md) - Инструкции по тестированию
- [Backend README](./backend/README.md) - Документация бэкенда

## Следующие шаги

- [x] Интеграция с Telegram MiniApp
- [x] Реализация API endpoints
- [x] Подключение базы данных
- [x] Аутентификация через Telegram
- [ ] Реализация функционала согласно PRD

## Лицензия

MIT

