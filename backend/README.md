# Travel Planner API

Backend API для планировщика групповых поездок на .NET 8.

## Быстрый старт

### Предварительные требования

- .NET 8 SDK
- SQLite (встроен в .NET)

### Установка и запуск

1. Перейдите в директорию проекта:
```bash
cd backend/TravelPlanner.Api
```

2. Восстановите зависимости:
```bash
dotnet restore
```

3. Настройте `appsettings.json`:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Data Source=travelplanner.db"
  },
  "Telegram": {
    "BotSecretKey": "your_bot_secret_key_here"
  },
  "Dev": {
    "MockTelegramId": "123456789"
  }
}
```

4. Запустите API:
```bash
dotnet run
```

API будет доступен по адресу `http://localhost:5000`

Swagger UI: `http://localhost:5000/swagger`

## Структура проекта

```
TravelPlanner.Api/
├── Controllers/          # API контроллеры
│   ├── TripsController.cs
│   ├── InvitesController.cs
│   └── TelegramController.cs
├── Models/               # Модели данных
│   ├── User.cs
│   ├── Trip.cs
│   ├── Membership.cs
│   └── Invite.cs
├── Data/                 # DbContext
│   └── ApplicationDbContext.cs
├── Services/             # Сервисы
│   └── TelegramAuthService.cs
├── Middleware/           # Middleware
│   └── TelegramAuthMiddleware.cs
├── DTOs/                 # Data Transfer Objects
│   ├── CreateTripDto.cs
│   ├── TripDto.cs
│   └── ...
└── Extensions/           # Расширения
    └── ClaimsPrincipalExtensions.cs
```

## База данных

Проект использует SQLite для разработки. База данных создается автоматически при первом запуске.

### Миграции

См. [MIGRATIONS.md](./MIGRATIONS.md) для подробной информации о миграциях.

**Создание миграции:**
```bash
dotnet ef migrations add <MigrationName>
```

**Применение миграций:**
```bash
dotnet ef database update
```

## API Документация

Полная документация API доступна в [API_DOCUMENTATION.md](./API_DOCUMENTATION.md).

### Основные endpoints:

- `GET /api/trips` - Получить мои поездки
- `GET /api/trips/{id}` - Получить поездку
- `POST /api/trips` - Создать поездку
- `PUT /api/trips/{tripId}/members/role` - Изменить роль участника
- `POST /api/invites` - Создать приглашение
- `POST /api/invites/join` - Присоединиться к поездке
- `POST /api/telegram/validate` - Валидация initData

## Авторизация

API использует авторизацию через Telegram initData:

1. **В заголовке:**
```
X-Telegram-Init-Data: <initData>
```

2. **В query параметре:**
```
?initData=<initData>
```

### Dev режим

В режиме разработки (`ASPNETCORE_ENVIRONMENT=Development`) авторизация автоматически использует мок-пользователя из конфигурации `Dev:MockTelegramId`.

## Конфигурация

### Переменные окружения

- `ASPNETCORE_ENVIRONMENT` - Окружение (Development/Production)
- `ASPNETCORE_URLS` - URL для запуска (по умолчанию `http://localhost:5000`)

### appsettings.json

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Data Source=travelplanner.db"
  },
  "Telegram": {
    "BotSecretKey": ""
  },
  "Dev": {
    "MockTelegramId": "123456789"
  }
}
```

## Тестирование

### Swagger UI

Откройте `http://localhost:5000/swagger` для интерактивного тестирования API.

### cURL примеры

См. [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) для примеров запросов.

## Production

Для production:

1. Измените connection string на PostgreSQL или SQL Server
2. Установите `Telegram:BotSecretKey` в конфигурации
3. Установите `ASPNETCORE_ENVIRONMENT=Production`
4. Настройте HTTPS

См. [MIGRATIONS.md](./MIGRATIONS.md) для инструкций по настройке production базы данных.

