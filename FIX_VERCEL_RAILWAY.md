# Исправление ошибки ngrok в Vercel

## Проблема
При открытии Mini App видна ошибка ngrok, потому что в Vercel установлен ngrok URL вместо Railway URL.

## Решение (2 минуты)

### Шаг 1: Найдите Railway URL

1. Откройте [Railway Dashboard](https://railway.app)
2. Выберите ваш проект
3. Откройте сервис с бэкендом
4. Перейдите в **Settings** → **Networking**
5. Найдите **Public Domain** (или нажмите "Generate Domain")
6. Скопируйте URL (например: `https://travelplanner-production-abc123.up.railway.app`)

**Проверка:** Откройте URL в браузере — должен открыться Swagger UI или API.

### Шаг 2: Обновите переменные окружения в Vercel

1. Откройте [Vercel Dashboard](https://vercel.com)
2. Выберите ваш проект
3. Перейдите в **Settings** → **Environment Variables**
4. Найдите `NEXT_PUBLIC_API_URL`
5. **Удалите** старую переменную (если там ngrok URL)
6. **Добавьте** новую:
   - **Key**: `NEXT_PUBLIC_API_URL`
   - **Value**: `https://your-railway-url.railway.app` (замените на ваш Railway URL)
   - **Environment**: Production, Preview, Development (выберите все)
7. Нажмите **Save**

### Шаг 3: Перезапустите деплой

**Вариант A: Redeploy в Vercel**
1. Перейдите в **Deployments**
2. Найдите последний деплой
3. Нажмите на три точки (⋮) → **Redeploy**
4. Подождите 1-2 минуты

**Вариант B: Через Git**
1. Сделайте любой коммит (например, обновите README)
2. Push в GitHub
3. Vercel автоматически задеплоит

### Шаг 4: Проверьте работу

1. Откройте Mini App в Telegram
2. Ошибка ngrok должна исчезнуть
3. Приложение должно загрузиться

## Если Railway URL не работает

### Проверьте, что бэкенд запущен:
1. Откройте Railway Dashboard
2. Проверьте, что сервис **Active** (зеленый статус)
3. Если нет — нажмите **Deploy** или **Redeploy**

### Проверьте логи:
1. В Railway Dashboard → **Deployments** → выберите последний деплой
2. Откройте **Logs**
3. Ищите ошибки (красные строки)

### Проверьте переменные окружения в Railway:
1. Railway Dashboard → **Variables**
2. Убедитесь, что установлены:
   ```
   ASPNETCORE_ENVIRONMENT=Production
   ConnectionStrings__DefaultConnection=Data Source=travelplanner.db
   Telegram__BotSecretKey=<ваш_secret_key>
   ```

## Правильные переменные окружения

### В Vercel:
```
NEXT_PUBLIC_API_URL=https://your-railway-url.railway.app
NEXT_PUBLIC_TELEGRAM_BOT_USERNAME=mvptravelrust
NEXT_PUBLIC_TELEGRAM_APP_NAME=mvptravelrust
```

### В Railway:
```
ASPNETCORE_ENVIRONMENT=Production
ConnectionStrings__DefaultConnection=Data Source=travelplanner.db
Telegram__BotSecretKey=<secret_key_из_@BotFather>
```

## Важно

- ❌ **НЕ используйте** ngrok URL в production (только для локальной разработки)
- ✅ **Используйте** Railway URL в Vercel
- ✅ **Используйте** HTTPS URLs (Railway и Vercel предоставляют HTTPS автоматически)

