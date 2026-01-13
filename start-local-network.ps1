# Скрипт для запуска с доступом из локальной сети (для телефона)

Write-Host "🔍 Поиск IP-адреса компьютера в локальной сети..." -ForegroundColor Cyan

$ipAddress = Get-NetIPAddress -AddressFamily IPv4 | 
    Where-Object {
        $_.IPAddress -like "192.168.*" -or 
        $_.IPAddress -like "10.*" -or 
        ($_.IPAddress -like "172.*" -and [int]($_.IPAddress.Split('.')[1]) -ge 16 -and [int]($_.IPAddress.Split('.')[1]) -le 31)
    } | 
    Select-Object -First 1 -ExpandProperty IPAddress

if (-not $ipAddress) {
    Write-Host "❌ Не удалось найти IP-адрес в локальной сети" -ForegroundColor Red
    Write-Host "Проверьте подключение к Wi-Fi" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Найден IP-адрес: $ipAddress" -ForegroundColor Green
Write-Host ""

# Обновляем .env.local
Write-Host "📝 Обновление .env.local..." -ForegroundColor Cyan
$envContent = @"
# API - IP-адрес компьютера в локальной сети
NEXT_PUBLIC_API_URL=http://$ipAddress:5000

# Telegram Bot (для создания ссылок-приглашений)
# Замените на ваши значения:
# NEXT_PUBLIC_TELEGRAM_BOT_USERNAME=your_bot_username
# NEXT_PUBLIC_TELEGRAM_APP_NAME=travel-planner
"@

$envContent | Out-File -FilePath .env.local -Encoding utf8
Write-Host "✅ .env.local обновлен с IP: $ipAddress" -ForegroundColor Green
Write-Host ""

# Останавливаем процессы
Write-Host "🛑 Остановка процессов на портах 5000 и 3000..." -ForegroundColor Yellow
Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess | ForEach-Object { Stop-Process -Id $_ -Force -ErrorAction SilentlyContinue }
Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess | ForEach-Object { Stop-Process -Id $_ -Force -ErrorAction SilentlyContinue }
Get-NetTCPConnection -LocalPort 3002 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess | ForEach-Object { Stop-Process -Id $_ -Force -ErrorAction SilentlyContinue }

Start-Sleep -Seconds 2

# Проверяем брандмауэр
Write-Host "🔥 Проверка брандмауэра..." -ForegroundColor Cyan
$firewallRule5000 = Get-NetFirewallRule -DisplayName "Travel Planner API" -ErrorAction SilentlyContinue
$firewallRule3000 = Get-NetFirewallRule -DisplayName "Travel Planner Frontend" -ErrorAction SilentlyContinue

if (-not $firewallRule5000) {
    Write-Host "   Создание правила брандмауэра для порта 5000..." -ForegroundColor Yellow
    New-NetFirewallRule -DisplayName "Travel Planner API" -Direction Inbound -LocalPort 5000 -Protocol TCP -Action Allow -ErrorAction SilentlyContinue | Out-Null
}

if (-not $firewallRule3000) {
    Write-Host "   Создание правила брандмауэра для порта 3000..." -ForegroundColor Yellow
    New-NetFirewallRule -DisplayName "Travel Planner Frontend" -Direction Inbound -LocalPort 3000 -Protocol TCP -Action Allow -ErrorAction SilentlyContinue | Out-Null
}

Write-Host "✅ Брандмауэр настроен" -ForegroundColor Green
Write-Host ""

# Запускаем бэкенд
Write-Host "📦 Запуск бэкенда на 0.0.0.0:5000 (доступен из сети)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\backend\TravelPlanner.Api'; `$env:ASPNETCORE_URLS='http://0.0.0.0:5000'; `$env:ASPNETCORE_ENVIRONMENT='Development'; dotnet run"

Start-Sleep -Seconds 5

# Запускаем фронтенд
Write-Host "⚛️  Запуск фронтенда на 0.0.0.0:3000 (доступен из сети)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot'; `$env:HOST='0.0.0.0'; npm run dev"

Write-Host ""
Write-Host "✅ Все сервисы запущены!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Информация для подключения:" -ForegroundColor Yellow
Write-Host "   IP-адрес компьютера: $ipAddress" -ForegroundColor White
Write-Host "   Бэкенд: http://$ipAddress:5000" -ForegroundColor White
Write-Host "   Фронтенд: http://$ipAddress:3000" -ForegroundColor White
Write-Host "   Swagger: http://$ipAddress:5000/swagger" -ForegroundColor White
Write-Host ""
Write-Host "📱 Для подключения с телефона:" -ForegroundColor Yellow
Write-Host "   1. Убедитесь, что телефон подключен к той же Wi-Fi сети" -ForegroundColor White
Write-Host "   2. Откройте в браузере: http://$ipAddress:3000" -ForegroundColor White
Write-Host "   3. Или через Telegram Mini App (если настроен ngrok)" -ForegroundColor White
Write-Host ""
Write-Host "⚠️  Важно:" -ForegroundColor Yellow
Write-Host "   - IP-адрес может измениться при переподключении к Wi-Fi" -ForegroundColor White
Write-Host "   - Для Telegram Mini App лучше использовать ngrok (см. LOCAL_PHONE_TESTING.md)" -ForegroundColor White

