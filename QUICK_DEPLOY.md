# Быстрый деплой для тестирования (15 минут)

## Шаг 1: Создайте Telegram Bot (5 минут)

1. Откройте [@BotFather](https://t.me/BotFather)
2. Отправьте `/newbot`
3. Укажите имя и username бота
4. **Сохраните Bot Token** (например: `123456789:ABCdef...`)

## Шаг 2: Деплой бэкенда на Railway (5 минут)

1. Зайдите на [railway.app](https://railway.app) → Sign up (через GitHub)
2. New Project → Deploy from GitHub repo
3. Выберите ваш репозиторий
4. Выберите папку: `backend/TravelPlanner.Api`
5. Railway автоматически определит .NET проект
6. В Settings → Variables добавьте:
   ```
   ASPNETCORE_ENVIRONMENT=Production
   Telegram__BotSecretKey=<пока_оставьте_пустым>
   ```
7. Дождитесь деплоя (2-3 минуты)
8. Скопируйте URL (например: `https://travelplanner-production.up.railway.app`)

## Шаг 3: Деплой фронтенда на Vercel (3 минуты)

1. Зайдите на [vercel.com](https://vercel.com) → Sign up (через GitHub)
2. Add New → Project
3. Импортируйте ваш репозиторий
4. В Environment Variables добавьте:
   ```
   NEXT_PUBLIC_API_URL=https://your-railway-url.railway.app
   NEXT_PUBLIC_TELEGRAM_BOT_USERNAME=your_bot_username
   NEXT_PUBLIC_TELEGRAM_APP_NAME=travel-planner
   ```
5. Deploy
6. Скопируйте URL (например: `https://travel-planner.vercel.app`)

## Шаг 4: Настройте Telegram Mini App (2 минуты)

1. Вернитесь к [@BotFather](https://t.me/BotFather)
2. Отправьте `/newapp`
3. Выберите вашего бота
4. Заполните:
   - **Title**: Travel Planner
   - **Description**: Планировщик поездок
   - **Web App URL**: `https://your-vercel-url.vercel.app`
   - **Short name**: `travel-planner`
5. **Сохраните Secret Key** (например: `1234567890:ABCdefGHIjklMNOpqrsTUVwxyz...`)

## Шаг 5: Обновите конфигурацию (1 минута)

1. В Railway → Settings → Variables:
   - Обновите `Telegram__BotSecretKey` на Secret Key из шага 4
   - Перезапустите сервис (Redeploy)

2. В Vercel → Settings → Environment Variables:
   - Убедитесь, что `NEXT_PUBLIC_TELEGRAM_BOT_USERNAME` и `NEXT_PUBLIC_TELEGRAM_APP_NAME` правильные
   - Redeploy

## Готово! 🎉

1. Откройте Telegram
2. Найдите вашего бота
3. Нажмите на кнопку "Open App" или отправьте `/start`
4. Приложение должно открыться!

## Troubleshooting

### "Unauthorized" ошибка
- Проверьте, что `Telegram__BotSecretKey` установлен в Railway
- Убедитесь, что открываете через Telegram Mini App (не браузер)

### CORS ошибки
- Убедитесь, что бэкенд доступен по HTTPS
- Проверьте, что используется политика `TelegramWebApp`

### База данных
- Railway автоматически создаст SQLite файл
- Для production лучше использовать PostgreSQL (см. DEPLOYMENT.md)

## Стоимость

- **Railway**: $5/месяц (или бесплатный тариф с ограничениями)
- **Vercel**: Бесплатно для личных проектов
- **Итого**: ~$5/месяц или бесплатно

## Альтернативы

- **Render.com** вместо Railway (бесплатный тариф)
- **Netlify** вместо Vercel (бесплатно)
- **Свой VPS** (см. DEPLOYMENT.md)

