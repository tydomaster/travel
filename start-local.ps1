# Запуск локального окружения для тестирования с телефона

Write-Host "🚀 Запуск локального окружения..." -ForegroundColor Green

# Проверяем наличие ngrok
$ngrokPath = "C:\ngrok\ngrok.exe"
if (-not (Test-Path $ngrokPath)) {
    Write-Host "❌ ngrok не найден по пути: $ngrokPath" -ForegroundColor Red
    Write-Host "Установите ngrok и укажите правильный путь в скрипте" -ForegroundColor Yellow
    Write-Host "Или измените переменную `$ngrokPath в этом скрипте" -ForegroundColor Yellow
    exit 1
}

# Останавливаем процессы на портах 5000 и 3000
Write-Host "🛑 Остановка процессов на портах 5000 и 3000..." -ForegroundColor Yellow
Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess | ForEach-Object { Stop-Process -Id $_ -Force -ErrorAction SilentlyContinue }
Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess | ForEach-Object { Stop-Process -Id $_ -Force -ErrorAction SilentlyContinue }
Get-NetTCPConnection -LocalPort 3002 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess | ForEach-Object { Stop-Process -Id $_ -Force -ErrorAction SilentlyContinue }

Start-Sleep -Seconds 2

# Запускаем бэкенд
Write-Host "📦 Запуск бэкенда на порту 5000..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\backend\TravelPlanner.Api'; `$env:ASPNETCORE_ENVIRONMENT='Development'; dotnet run"

Start-Sleep -Seconds 5

# Запускаем ngrok для бэкенда
Write-Host "🌐 Запуск ngrok для бэкенда (порт 5000)..." -ForegroundColor Cyan
Write-Host "   Откройте http://localhost:4040 для просмотра ngrok dashboard" -ForegroundColor Gray
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd C:\ngrok; .\ngrok.exe http 5000"

Start-Sleep -Seconds 3

# Проверяем .env.local
$envFile = "$PSScriptRoot\.env.local"
if (-not (Test-Path $envFile)) {
    Write-Host "⚠️  Файл .env.local не найден. Создаю шаблон..." -ForegroundColor Yellow
    @"
# API
NEXT_PUBLIC_API_URL=http://localhost:5000

# Telegram Bot (для создания ссылок-приглашений)
# Замените на ваши значения после получения ngrok URL:
# NEXT_PUBLIC_TELEGRAM_BOT_USERNAME=your_bot_username
# NEXT_PUBLIC_TELEGRAM_APP_NAME=travel-planner
"@ | Out-File -FilePath $envFile -Encoding utf8
    Write-Host "   Создан файл .env.local. Обновите его после получения ngrok URL!" -ForegroundColor Yellow
}

# Запускаем фронтенд
Write-Host "⚛️  Запуск фронтенда на порту 3000..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot'; npm run dev"

Start-Sleep -Seconds 5

# Запускаем ngrok для фронтенда
Write-Host "🌐 Запуск ngrok для фронтенда (порт 3000)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd C:\ngrok; .\ngrok.exe http 3000"

Write-Host ""
Write-Host "✅ Все сервисы запущены!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Следующие шаги:" -ForegroundColor Yellow
Write-Host "1. Откройте http://localhost:4040 для просмотра ngrok dashboard" -ForegroundColor White
Write-Host "2. Скопируйте HTTPS URL из ngrok (фронтенд, порт 3000)" -ForegroundColor White
Write-Host "3. Скопируйте HTTPS URL из ngrok (бэкенд, порт 5000)" -ForegroundColor White
Write-Host "4. Обновите .env.local:" -ForegroundColor White
Write-Host "   - NEXT_PUBLIC_API_URL=<ngrok_url_бэкенда>" -ForegroundColor Gray
Write-Host "   - NEXT_PUBLIC_TELEGRAM_BOT_USERNAME=<ваш_bot_username>" -ForegroundColor Gray
Write-Host "   - NEXT_PUBLIC_TELEGRAM_APP_NAME=travel-planner" -ForegroundColor Gray
Write-Host "5. Обновите Web App URL в @BotFather на <ngrok_url_фронтенда>" -ForegroundColor White
Write-Host "6. Обновите Telegram__BotSecretKey в appsettings.json" -ForegroundColor White
Write-Host "7. Перезапустите фронтенд и бэкенд" -ForegroundColor White
Write-Host ""
Write-Host "🌐 ngrok dashboard: http://localhost:4040" -ForegroundColor Cyan
Write-Host "📱 Тестируйте через Telegram Mini App на телефоне!" -ForegroundColor Green

