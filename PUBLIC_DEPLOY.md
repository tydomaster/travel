# Публичный деплой для всех пользователей Telegram

## Быстрый деплой (15-20 минут)

### Шаг 1: Создайте Telegram Bot (если еще не создан)

1. Откройте [@BotFather](https://t.me/BotFather) в Telegram
2. Отправьте `/newbot`
3. Следуйте инструкциям:
   - Укажите имя бота (например: "Travel Planner")
   - Укажите username (должен заканчиваться на `bot`, например: `travel_planner_bot`)
4. **Сохраните Bot Token** (например: `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`)

### Шаг 2: Деплой бэкенда на Railway (бесплатный тариф)

1. Зарегистрируйтесь на [railway.app](https://railway.app) (можно через GitHub)
2. Нажмите "New Project" → "Deploy from GitHub repo"
3. Выберите ваш репозиторий
4. В настройках проекта:
   - **Root Directory**: `backend/TravelPlanner.Api`
   - Railway автоматически определит .NET проект
5. Перейдите в **Variables** и добавьте:
   ```
   ASPNETCORE_ENVIRONMENT=Production
   ConnectionStrings__DefaultConnection=Data Source=/app/data/travelplanner.db
   Telegram__BotSecretKey=<пока_оставьте_пустым>
   ```
6. Дождитесь деплоя (2-3 минуты)
7. Скопируйте **Public URL** (например: `https://travelplanner-production.up.railway.app`)

**Альтернатива: Render.com**
- Аналогично Railway, но может потребоваться Dockerfile (уже создан)

### Шаг 3: Деплой фронтенда на Vercel (бесплатно)

1. Зарегистрируйтесь на [vercel.com](https://vercel.com) (можно через GitHub)
2. Нажмите "Add New..." → "Project"
3. Импортируйте ваш репозиторий
4. Настройки проекта:
   - **Framework Preset**: Next.js (определится автоматически)
   - **Root Directory**: `.` (корень проекта)
   - **Build Command**: `npm run build` (по умолчанию)
   - **Output Directory**: `.next` (по умолчанию)
5. В **Environment Variables** добавьте:
   ```
   NEXT_PUBLIC_API_URL=https://your-railway-url.railway.app
   NEXT_PUBLIC_TELEGRAM_BOT_USERNAME=your_bot_username
   NEXT_PUBLIC_TELEGRAM_APP_NAME=travel-planner
   ```
   ⚠️ Замените `your-railway-url` на URL из шага 2, а `your_bot_username` на username вашего бота (без @)
6. Нажмите "Deploy"
7. Дождитесь деплоя (2-3 минуты)
8. Скопируйте **Production URL** (например: `https://travel-planner.vercel.app`)

### Шаг 4: Настройте Telegram Mini App

1. Вернитесь к [@BotFather](https://t.me/BotFather)
2. Отправьте `/newapp`
3. Выберите вашего бота из списка
4. Заполните форму:
   - **Title**: Travel Planner (или любое другое название)
   - **Description**: Планировщик групповых поездок
   - **Photo**: Загрузите иконку (опционально, 640x360px)
   - **Web App URL**: `https://your-vercel-url.vercel.app` (URL из шага 3)
   - **Short name**: `travel-planner` (будет использоваться в URL)
5. **Сохраните Secret Key** (например: `1234567890:ABCdefGHIjklMNOpqrsTUVwxyz...`)

### Шаг 5: Обновите конфигурацию

1. **В Railway** (бэкенд):
   - Перейдите в **Variables**
   - Обновите `Telegram__BotSecretKey` на Secret Key из шага 4
   - Нажмите "Redeploy" или подождите автоматического перезапуска

2. **В Vercel** (фронтенд):
   - Перейдите в **Settings** → **Environment Variables**
   - Убедитесь, что все переменные правильные:
     - `NEXT_PUBLIC_API_URL` = URL бэкенда из Railway
     - `NEXT_PUBLIC_TELEGRAM_BOT_USERNAME` = username бота (без @)
     - `NEXT_PUBLIC_TELEGRAM_APP_NAME` = short name из шага 4
   - Нажмите "Redeploy" → "Redeploy" для production

### Шаг 6: Проверьте работу

1. Откройте Telegram
2. Найдите вашего бота (по username)
3. Нажмите на кнопку "Open App" или отправьте `/start`
4. Приложение должно открыться!

### Шаг 7: Поделитесь с пользователями

Теперь любой пользователь Telegram может:
1. Найти вашего бота по username
2. Открыть Mini App
3. Использовать приложение

**Ссылка для шаринга:**
```
https://t.me/your_bot_username
```

Или создайте кнопку в боте через @BotFather:
```
/newcommand
```

## Важные замечания

### HTTPS обязателен
- Telegram требует HTTPS для Mini Apps
- Vercel и Railway предоставляют HTTPS автоматически

### База данных
- Railway использует SQLite по умолчанию (файл хранится в `/app/data`)
- Для production с большим количеством пользователей лучше использовать PostgreSQL
- См. `DEPLOYMENT.md` для настройки PostgreSQL

### Ограничения бесплатных планов

**Railway:**
- $5/месяц бесплатно (или $5 кредитов)
- После исчерпания нужно платить

**Vercel:**
- Бесплатно для личных проектов
- Ограничения по трафику и функциям

### Мониторинг

**Railway:**
- Логи доступны в dashboard
- Метрики использования

**Vercel:**
- Analytics в dashboard
- Логи деплоев

## Troubleshooting

### "Unauthorized" ошибка
- Проверьте, что `Telegram__BotSecretKey` установлен в Railway
- Убедитесь, что Secret Key правильный (из @BotFather)

### CORS ошибки
- Убедитесь, что в `Program.cs` используется политика `TelegramWebApp` (AllowAnyOrigin)
- Проверьте, что бэкенд доступен по HTTPS

### База данных не работает
- Проверьте права доступа к `/app/data` в Railway
- Убедитесь, что миграции применены (автоматически при первом запуске)

### Приложение не открывается в Telegram
- Проверьте, что Web App URL в @BotFather правильный (HTTPS)
- Убедитесь, что фронтенд задеплоен и доступен
- Проверьте консоль браузера в Telegram (Settings → Advanced → WebView Debug)

## Обновление приложения

После изменений в коде:

1. **Фронтенд**: Vercel автоматически задеплоит при push в GitHub
2. **Бэкенд**: Railway автоматически задеплоит при push в GitHub
3. Или нажмите "Redeploy" вручную

## Стоимость

- **Railway**: $5/месяц (или бесплатный тариф с ограничениями)
- **Vercel**: Бесплатно для личных проектов
- **Итого**: ~$5/месяц или бесплатно (с ограничениями)

## Альтернативы

Если хотите полностью бесплатно:
- **Render.com** вместо Railway (бесплатный тариф)
- **Netlify** вместо Vercel (бесплатно)

См. `DEPLOYMENT.md` для подробных инструкций.

