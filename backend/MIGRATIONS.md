# Миграции базы данных

## Настройка

Проект использует Entity Framework Core с SQLite для разработки.

## Первая миграция

### Создание миграции

```bash
cd backend/TravelPlanner.Api
dotnet ef migrations add InitialCreate
```

Эта команда создаст папку `Migrations/` с файлами миграции.

### Применение миграции

```bash
dotnet ef database update
```

Или при запуске приложения миграция применяется автоматически через `db.Database.EnsureCreated()`.

## Управление миграциями

### Создать новую миграцию

```bash
dotnet ef migrations add <MigrationName>
```

Например:
```bash
dotnet ef migrations add AddUserAvatar
```

### Применить миграции

```bash
dotnet ef database update
```

### Откатить последнюю миграцию

```bash
dotnet ef database update <PreviousMigrationName>
```

### Удалить последнюю миграцию (если еще не применена)

```bash
dotnet ef migrations remove
```

### Просмотр всех миграций

```bash
dotnet ef migrations list
```

## Структура базы данных

### Таблица Users
- `Id` (int, PK)
- `TelegramId` (bigint, unique)
- `Name` (string, max 200)
- `Avatar` (string, nullable)
- `CreatedAt` (datetime)
- `UpdatedAt` (datetime)

### Таблица Trips
- `Id` (int, PK)
- `Title` (string, max 200)
- `StartDate` (datetime, nullable)
- `EndDate` (datetime, nullable)
- `OwnerId` (int, FK -> Users)
- `CreatedAt` (datetime)
- `UpdatedAt` (datetime)

### Таблица Memberships
- `Id` (int, PK)
- `TripId` (int, FK -> Trips)
- `UserId` (int, FK -> Users)
- `Role` (int) - 1: Owner, 2: Editor, 3: Viewer
- `CreatedAt` (datetime)
- Unique constraint на (TripId, UserId)

### Таблица Invites
- `Id` (int, PK)
- `TripId` (int, FK -> Trips)
- `Token` (string, max 64, unique)
- `ExpiresAt` (datetime)
- `CreatedAt` (datetime)
- `IsUsed` (bool)

## Production

Для production рекомендуется использовать PostgreSQL или SQL Server.

### Изменение на PostgreSQL

1. Добавьте пакет:
```xml
<PackageReference Include="Npgsql.EntityFrameworkCore.PostgreSQL" Version="8.0.0" />
```

2. Измените `Program.cs`:
```csharp
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(connectionString));
```

3. Обновите connection string в `appsettings.json`:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Database=travelplanner;Username=postgres;Password=password"
  }
}
```

### Изменение на SQL Server

1. Добавьте пакет (уже включен):
```xml
<PackageReference Include="Microsoft.EntityFrameworkCore.SqlServer" Version="8.0.0" />
```

2. Измените `Program.cs`:
```csharp
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(connectionString));
```

3. Обновите connection string:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=TravelPlanner;Trusted_Connection=True;TrustServerCertificate=True"
  }
}
```

## Сброс базы данных

⚠️ **Внимание:** Это удалит все данные!

```bash
dotnet ef database drop
dotnet ef database update
```

Или удалите файл `travelplanner.db` и перезапустите приложение.

