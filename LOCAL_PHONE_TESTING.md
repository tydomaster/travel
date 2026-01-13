# Локальный запуск с доступом с телефона

## Быстрая настройка (5 минут)

### Шаг 1: Установите ngrok

1. Зарегистрируйтесь на [ngrok.com](https://ngrok.com) (бесплатно)
2. Скачайте ngrok для Windows: https://ngrok.com/download
3. Распакуйте в удобную папку (например, `C:\ngrok`)
4. Получите authtoken на [dashboard.ngrok.com](https://dashboard.ngrok.com/get-started/your-authtoken)
5. Выполните:
   ```powershell
   cd C:\ngrok
   .\ngrok.exe authtoken <ваш_authtoken>
   ```

### Шаг 2: Создайте Telegram Bot (если еще не создан)

1. Откройте [@BotFather](https://t.me/BotFather)
2. Отправьте `/newbot` (если бота нет)
3. Сохраните **Bot Token**

### Шаг 3: Запустите бэкенд

```powershell
cd backend\TravelPlanner.Api
$env:ASPNETCORE_ENVIRONMENT="Development"
dotnet run
```

Бэкенд запустится на `http://localhost:5000`

### Шаг 4: Запустите ngrok для бэкенда

В новом окне PowerShell:
```powershell
cd C:\ngrok
.\ngrok.exe http 5000
```

Скопируйте HTTPS URL (например: `https://abc123.ngrok-free.app`)

### Шаг 5: Запустите фронтенд

В новом окне PowerShell:
```powershell
cd G:\trav2
$env:NEXT_PUBLIC_API_URL="https://abc123.ngrok-free.app"
npm run dev
```

Фронтенд запустится на `http://localhost:3000` (или 3002)

### Шаг 6: Запустите ngrok для фронтенда

В новом окне PowerShell:
```powershell
cd C:\ngrok
.\ngrok.exe http 3000
```

Скопируйте HTTPS URL (например: `https://xyz789.ngrok-free.app`)

### Шаг 7: Настройте переменные окружения фронтенда

Создайте `.env.local` в корне проекта:
```env
NEXT_PUBLIC_API_URL=https://abc123.ngrok-free.app
NEXT_PUBLIC_TELEGRAM_BOT_USERNAME=your_bot_username
NEXT_PUBLIC_TELEGRAM_APP_NAME=travel-planner
```

Перезапустите фронтенд:
```powershell
npm run dev
```

### Шаг 8: Настройте Telegram Mini App

1. Откройте [@BotFather](https://t.me/BotFather)
2. Отправьте `/newapp`
3. Выберите вашего бота
4. Заполните:
   - **Title**: Travel Planner
   - **Description**: Планировщик поездок
   - **Web App URL**: `https://xyz789.ngrok-free.app` (URL фронтенда из ngrok)
   - **Short name**: `travel-planner`
5. **Сохраните Secret Key**

### Шаг 9: Настройте бэкенд

Обновите `backend/TravelPlanner.Api/appsettings.json`:
```json
{
  "Telegram": {
    "BotSecretKey": "<ваш_secret_key_из_шага_8>"
  }
}
```

Перезапустите бэкенд.

### Шаг 10: Тестируйте с телефона!

1. Откройте Telegram на телефоне
2. Найдите вашего бота
3. Нажмите на кнопку "Open App" или отправьте `/start`
4. Приложение должно открыться!

## Автоматизация через скрипты

### Скрипт для запуска всего (start-local.ps1)

Создайте файл `start-local.ps1` в корне проекта:

```powershell
# Запуск локального окружения для тестирования с телефона

Write-Host "🚀 Запуск локального окружения..." -ForegroundColor Green

# Проверяем наличие ngrok
$ngrokPath = "C:\ngrok\ngrok.exe"
if (-not (Test-Path $ngrokPath)) {
    Write-Host "❌ ngrok не найден по пути: $ngrokPath" -ForegroundColor Red
    Write-Host "Установите ngrok и укажите правильный путь в скрипте" -ForegroundColor Yellow
    exit 1
}

# Запускаем бэкенд
Write-Host "📦 Запуск бэкенда..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\backend\TravelPlanner.Api'; `$env:ASPNETCORE_ENVIRONMENT='Development'; dotnet run"

Start-Sleep -Seconds 5

# Запускаем ngrok для бэкенда
Write-Host "🌐 Запуск ngrok для бэкенда (порт 5000)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd C:\ngrok; .\ngrok.exe http 5000"

Start-Sleep -Seconds 3

# Запускаем фронтенд
Write-Host "⚛️  Запуск фронтенда..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot'; npm run dev"

Start-Sleep -Seconds 5

# Запускаем ngrok для фронтенда
Write-Host "🌐 Запуск ngrok для фронтенда (порт 3000)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd C:\ngrok; .\ngrok.exe http 3000"

Write-Host ""
Write-Host "✅ Все сервисы запущены!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Следующие шаги:" -ForegroundColor Yellow
Write-Host "1. Скопируйте HTTPS URL из ngrok (фронтенд)" -ForegroundColor White
Write-Host "2. Обновите Web App URL в @BotFather" -ForegroundColor White
Write-Host "3. Обновите NEXT_PUBLIC_API_URL в .env.local на URL бэкенда из ngrok" -ForegroundColor White
Write-Host "4. Перезапустите фронтенд" -ForegroundColor White
Write-Host ""
Write-Host "🌐 ngrok dashboard: http://localhost:4040" -ForegroundColor Cyan
```

Запуск:
```powershell
.\start-local.ps1
```

## Важные замечания

### ngrok бесплатный план

- **Ограничения**: 
  - URL меняется при каждом перезапуске (решается через ngrok account)
  - Ограничение по трафику
  - Может быть медленнее

### Решение проблемы с меняющимся URL

1. Зарегистрируйтесь на [ngrok.com](https://ngrok.com)
2. В бесплатном плане можно зарезервировать домен (ограниченное время)
3. Или используйте ngrok config для постоянного домена (платно)

### Альтернатива: Cloudflare Tunnel (бесплатно, постоянный домен)

1. Установите `cloudflared`:
   ```powershell
   winget install --id Cloudflare.cloudflared
   ```

2. Запустите туннель для бэкенда:
   ```powershell
   cloudflared tunnel --url http://localhost:5000
   ```

3. Запустите туннель для фронтенда:
   ```powershell
   cloudflared tunnel --url http://localhost:3000
   ```

Cloudflare Tunnel предоставляет постоянный домен (но тоже меняется при перезапуске в бесплатном плане).

## Troubleshooting

### "ngrok: command not found"
- Убедитесь, что ngrok установлен и путь правильный
- Или добавьте ngrok в PATH

### "CORS error"
- Убедитесь, что в `Program.cs` используется политика `TelegramWebApp` (AllowAnyOrigin)
- Проверьте, что бэкенд доступен через ngrok

### "Unauthorized"
- Проверьте, что `Telegram__BotSecretKey` установлен в `appsettings.json`
- Убедитесь, что приложение открыто через Telegram Mini App

### URL меняется при перезапуске ngrok
- Это нормально для бесплатного плана
- Обновите URL в @BotFather каждый раз
- Или используйте платный план ngrok для постоянного домена

## Проверка работы

1. Откройте ngrok dashboard: http://localhost:4040
2. Проверьте, что оба туннеля активны (бэкенд и фронтенд)
3. Откройте Telegram на телефоне
4. Найдите вашего бота
5. Нажмите "Open App"

## Следующие шаги

После тестирования локально:
- Деплой на production сервер (см. `DEPLOYMENT.md`)
- Настройка постоянного домена
- Настройка CI/CD для автоматического деплоя

