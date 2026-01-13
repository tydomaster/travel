# Настройка ссылок-приглашений для Telegram Mini App

## Как это работает

Ссылки-приглашения теперь создаются в формате Telegram Mini App deep link:
```
https://t.me/bot_username/app_name?startapp=token
```

При открытии такой ссылки:
1. Telegram открывает Mini App
2. Параметр `startapp` передается в `initData.start_param`
3. Приложение автоматически обрабатывает токен и присоединяет пользователя к поездке

## Настройка

### 1. Получите данные бота

1. Откройте [@BotFather](https://t.me/botfather) в Telegram
2. Найдите вашего бота в списке
3. Запомните **username** бота (например, `my_travel_bot`)
4. При создании Web App запомните **short name** (например, `travel-planner`)

### 2. Настройте переменные окружения

Создайте файл `.env.local` в корне проекта:

```env
# Telegram Bot для ссылок-приглашений
NEXT_PUBLIC_TELEGRAM_BOT_USERNAME=my_travel_bot
NEXT_PUBLIC_TELEGRAM_APP_NAME=travel-planner
```

**Важно:**
- `NEXT_PUBLIC_TELEGRAM_BOT_USERNAME` - username бота без @ (например, `my_travel_bot`)
- `NEXT_PUBLIC_TELEGRAM_APP_NAME` - short name Web App, указанный в @BotFather

### 3. Перезапустите приложение

После изменения `.env.local` перезапустите Next.js:

```bash
npm run dev
```

## Использование

1. Создайте поездку
2. На странице поездки нажмите "Создать ссылку-приглашение"
3. Ссылка будет скопирована в формате: `https://t.me/my_travel_bot/travel-planner?startapp=token`
4. Отправьте ссылку друзьям
5. При открытии ссылки в Telegram откроется Mini App и пользователь автоматически присоединится к поездке

## Формат ссылки

```
https://t.me/{bot_username}/{app_name}?startapp={invite_token}
```

Где:
- `bot_username` - username бота (без @)
- `app_name` - short name Web App
- `invite_token` - токен приглашения

## Пример

Если:
- Bot username: `my_travel_bot`
- App name: `travel-planner`
- Token: `abc123def456`

То ссылка будет:
```
https://t.me/my_travel_bot/travel-planner?startapp=abc123def456
```

## Troubleshooting

### Ссылка не открывает Mini App

1. Проверьте, что username бота указан правильно (без @)
2. Проверьте, что app name совпадает с short name в @BotFather
3. Убедитесь, что Web App настроен в @BotFather

### Токен не обрабатывается

1. Проверьте, что страница `/trips/[id]/join` правильно обрабатывает `start_param`
2. Убедитесь, что `window.Telegram.WebApp.initDataUnsafe.start_param` доступен
3. Проверьте консоль браузера на наличие ошибок

