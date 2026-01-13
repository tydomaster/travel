# Инструкции по тестированию Telegram MiniApp

## Быстрый старт

### 1. Локальная разработка (Dev-режим)

Просто запустите приложение:

```bash
npm run dev
```

Откройте `http://localhost:3000` в браузере. Приложение автоматически определит, что оно запущено не в Telegram, и переключится в dev-режим с мок-данными.

### 2. Тестирование в Telegram

#### Шаг 1: Настройка туннеля

Используйте один из вариантов:

**Вариант A: ngrok (рекомендуется)**
```bash
# Установите ngrok: https://ngrok.com/download
ngrok http 3000
```

**Вариант B: localtunnel**
```bash
npm install -g localtunnel
lt --port 3000
```

**Вариант C: Cloudflare Tunnel**
```bash
# Установите cloudflared: https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/installation/
cloudflared tunnel --url http://localhost:3000
```

#### Шаг 2: Создание бота

1. Откройте [@BotFather](https://t.me/botfather) в Telegram
2. Отправьте `/newbot`
3. Следуйте инструкциям:
   - Укажите имя бота
   - Укажите username бота (должен заканчиваться на `bot`)
4. Сохраните токен бота (например, `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`)

#### Шаг 3: Создание Web App

1. В @BotFather отправьте `/newapp`
2. Выберите вашего бота из списка
3. Укажите:
   - **Title**: Travel Planner (или любое другое название)
   - **Description**: Планировщик групповых поездок
   - **Photo**: Загрузите иконку (опционально, 640x360px)
   - **Web App URL**: `https://your-tunnel-url.ngrok.io` (URL из шага 1)
   - **Short name**: travel-planner (будет использоваться в URL)

#### Шаг 4: Тестирование

1. Найдите вашего бота в Telegram
2. Откройте меню бота (кнопка с тремя линиями)
3. Нажмите на кнопку вашего Web App
4. Приложение откроется внутри Telegram

## Проверка функционала

### ✅ Что должно работать:

1. **Инициализация**
   - Приложение должно автоматически инициализироваться
   - Должны применяться цвета темы Telegram

2. **Кнопка Back**
   - На страницах кроме главной должна отображаться кнопка "Back"
   - При нажатии должна происходить навигация назад

3. **Тема**
   - Цвета должны соответствовать теме Telegram
   - При изменении темы в Telegram, цвета должны обновляться

4. **Viewport**
   - Приложение должно корректно отображаться на мобильных устройствах
   - Не должно быть горизонтальной прокрутки

5. **Dev-режим**
   - При открытии не из Telegram показывается предупреждение
   - Используются мок-данные пользователя

## Отладка

### Проверка initData

Откройте консоль браузера (в Telegram: меню → Settings → Advanced → WebView Debug) и проверьте:

```javascript
// Проверка наличия Telegram Web App
console.log(window.Telegram?.WebApp)

// Проверка initData
console.log(window.Telegram?.WebApp.initData)

// Проверка данных пользователя
console.log(window.Telegram?.WebApp.initDataUnsafe.user)
```

### Проверка валидации

Валидация initData происходит автоматически при загрузке приложения. Проверить можно через Network tab в DevTools:

- Запрос к `/api/telegram/validate` должен возвращать `{ valid: true }`

## Частые проблемы

### Проблема: "initData не найден"

**Решение**: Убедитесь, что приложение открыто через Telegram Web App, а не напрямую в браузере.

### Проблема: Кнопка Back не работает

**Решение**: 
1. Проверьте, что используется компонент `TelegramHeader`
2. Убедитесь, что `showBack={true}`
3. Проверьте консоль на наличие ошибок

### Проблема: Цвета не применяются

**Решение**:
1. Проверьте, что `TelegramProvider` обернут вокруг всего приложения
2. Убедитесь, что CSS переменные определены в `globals.css`
3. Проверьте консоль на наличие ошибок

### Проблема: ngrok показывает "502 Bad Gateway"

**Решение**:
1. Убедитесь, что локальный сервер запущен на порту 3000
2. Проверьте, что ngrok указывает на правильный порт
3. Перезапустите ngrok

## Production

Для production необходимо:

1. **Реализовать реальную валидацию initData**
   - Использовать секретный ключ бота
   - Проверять HMAC-SHA256 подпись
   - См. документацию: https://core.telegram.org/bots/webapps#validating-data-received-via-the-mini-app

2. **Настроить HTTPS**
   - Telegram требует HTTPS для Web Apps
   - Используйте сервисы типа Vercel, Netlify или собственный сервер с SSL

3. **Добавить переменные окружения**
   ```env
   TELEGRAM_BOT_TOKEN=your_production_token
   TELEGRAM_BOT_SECRET_KEY=your_secret_key
   ```

4. **Обновить URL Web App в @BotFather**
   - Укажите production URL вместо ngrok

