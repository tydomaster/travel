# Настройка для работы с телефона в локальной сети

## Проблема

Когда вы открываете приложение с телефона, `localhost` указывает на сам телефон, а не на ваш компьютер. Поэтому нужно использовать IP-адрес вашего компьютера в локальной сети.

## Быстрое решение

### Шаг 1: Найдите IP-адрес вашего компьютера

**Windows:**
```powershell
ipconfig
```

Найдите IPv4-адрес (обычно начинается с `192.168.` или `10.`)

**Или через PowerShell:**
```powershell
Get-NetIPAddress -AddressFamily IPv4 | Where-Object {$_.IPAddress -like "192.168.*" -or $_.IPAddress -like "10.*"}
```

### Шаг 2: Обновите .env.local

Замените `localhost` на IP-адрес вашего компьютера:

```env
# API - используйте IP вашего компьютера вместо localhost
NEXT_PUBLIC_API_URL=http://192.168.1.100:5000

# Telegram Bot
NEXT_PUBLIC_TELEGRAM_BOT_USERNAME=your_bot_username
NEXT_PUBLIC_TELEGRAM_APP_NAME=travel-planner
```

**Важно:** Замените `192.168.1.100` на ваш реальный IP-адрес!

### Шаг 3: Настройте бэкенд для работы в сети

Бэкенд по умолчанию слушает только `localhost`. Нужно настроить его для работы в сети:

**Вариант A: Через переменную окружения (рекомендуется)**

При запуске бэкенда:
```powershell
cd backend\TravelPlanner.Api
$env:ASPNETCORE_URLS="http://0.0.0.0:5000"
$env:ASPNETCORE_ENVIRONMENT="Development"
dotnet run
```

**Вариант B: Через appsettings.json**

Добавьте в `appsettings.json`:
```json
{
  "Urls": "http://0.0.0.0:5000"
}
```

### Шаг 4: Настройте брандмауэр Windows

1. Откройте "Брандмауэр Защитника Windows"
2. Нажмите "Дополнительные параметры"
3. Правила для входящих подключений → Создать правило
4. Выберите "Порт" → TCP → Укажите порт 5000
5. Разрешите подключение
6. Повторите для порта 3000 (фронтенд)

**Или через PowerShell (от имени администратора):**
```powershell
New-NetFirewallRule -DisplayName "Travel Planner API" -Direction Inbound -LocalPort 5000 -Protocol TCP -Action Allow
New-NetFirewallRule -DisplayName "Travel Planner Frontend" -Direction Inbound -LocalPort 3000 -Protocol TCP -Action Allow
```

### Шаг 5: Перезапустите сервисы

1. Остановите бэкенд и фронтенд
2. Запустите бэкенд с новыми настройками:
   ```powershell
   cd backend\TravelPlanner.Api
   $env:ASPNETCORE_URLS="http://0.0.0.0:5000"
   $env:ASPNETCORE_ENVIRONMENT="Development"
   dotnet run
   ```

3. Перезапустите фронтенд (он подхватит новый .env.local)

### Шаг 6: Откройте с телефона

1. Убедитесь, что телефон подключен к той же Wi-Fi сети, что и компьютер
2. Откройте в браузере телефона: `http://192.168.1.100:3000` (замените на ваш IP)
3. Или через Telegram Mini App (если настроен ngrok)

## Альтернатива: Использование ngrok (для Telegram Mini App)

Если вы хотите использовать Telegram Mini App, лучше использовать ngrok (см. `LOCAL_PHONE_TESTING.md`), так как:
- Telegram требует HTTPS
- ngrok предоставляет HTTPS автоматически
- Не нужно настраивать брандмауэр

## Проверка

### Проверьте доступность с телефона:

1. Откройте браузер на телефоне
2. Перейдите на `http://<ваш_ip>:5000/swagger`
3. Должен открыться Swagger UI

Если не открывается:
- Проверьте, что телефон в той же Wi-Fi сети
- Проверьте брандмауэр
- Проверьте, что бэкенд слушает на `0.0.0.0:5000` (а не только `localhost`)

## Troubleshooting

### "Connection refused" или "Network error"
- Убедитесь, что бэкенд слушает на `0.0.0.0:5000`, а не только `localhost`
- Проверьте брандмауэр Windows
- Убедитесь, что телефон в той же сети

### "CORS error"
- Убедитесь, что в `Program.cs` используется политика `TelegramWebApp` (AllowAnyOrigin)
- Проверьте, что запросы идут на правильный IP

### IP-адрес меняется
- IP-адрес может меняться при переподключении к Wi-Fi
- Используйте статический IP или DHCP reservation в роутере
- Или используйте ngrok для постоянного URL

