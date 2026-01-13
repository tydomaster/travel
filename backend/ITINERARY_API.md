# Itinerary API Documentation

## Models

### Day
- `Id` (int) - Уникальный идентификатор
- `TripId` (int) - ID поездки
- `Date` (DateTime) - Дата дня
- `CreatedAt` (DateTime) - Дата создания
- `UpdatedAt` (DateTime) - Дата обновления
- `Items` (ICollection<Item>) - Список пунктов дня

### Item
- `Id` (int) - Уникальный идентификатор
- `DayId` (int) - ID дня
- `StartTime` (TimeSpan?) - Время начала (опционально)
- `DurationMinutes` (int?) - Длительность в минутах (опционально)
- `Title` (string) - Название пункта
- `PlaceId` (int?) - ID места (опционально, для будущей интеграции)
- `Notes` (string?) - Заметки (опционально)
- `Order` (int) - Порядок отображения
- `CreatedAt` (DateTime) - Дата создания
- `UpdatedAt` (DateTime) - Дата обновления

## Endpoints

### Days

#### GET `/api/trips/{tripId}/days`
Получить все дни поездки.

**Требования:**
- Авторизация (любая роль)

**Ответ:** `List<DayDto>`

#### GET `/api/trips/{tripId}/days/{dayId}`
Получить конкретный день.

**Требования:**
- Авторизация (любая роль)

**Ответ:** `DayDto`

#### POST `/api/trips/{tripId}/days`
Создать новый день.

**Требования:**
- Авторизация
- Роль: Owner или Editor

**Тело запроса:**
```json
{
  "date": "2024-01-15T00:00:00Z"
}
```

**Ответ:** `DayDto`

#### DELETE `/api/trips/{tripId}/days/{dayId}`
Удалить день.

**Требования:**
- Авторизация
- Роль: Owner или Editor

**Ответ:** `204 No Content`

### Items

#### POST `/api/trips/{tripId}/days/{dayId}/items`
Создать новый пункт.

**Требования:**
- Авторизация
- Роль: Owner или Editor

**Тело запроса:**
```json
{
  "startTime": "09:00",
  "durationMinutes": 60,
  "title": "Завтрак",
  "placeId": null,
  "notes": "В отеле",
  "order": 0
}
```

**Ответ:** `ItemDto`

#### GET `/api/trips/{tripId}/days/{dayId}/items/{itemId}`
Получить конкретный пункт.

**Требования:**
- Авторизация (любая роль)

**Ответ:** `ItemDto`

#### PUT `/api/trips/{tripId}/days/{dayId}/items/{itemId}`
Обновить пункт.

**Требования:**
- Авторизация
- Роль: Owner или Editor

**Тело запроса:** (аналогично CreateItemDto)

**Ответ:** `ItemDto`

#### DELETE `/api/trips/{tripId}/days/{dayId}/items/{itemId}`
Удалить пункт.

**Требования:**
- Авторизация
- Роль: Owner или Editor

**Ответ:** `204 No Content`

#### PUT `/api/trips/{tripId}/days/{dayId}/items/reorder`
Изменить порядок пунктов.

**Требования:**
- Авторизация
- Роль: Owner или Editor

**Тело запроса:**
```json
{
  "itemIds": [3, 1, 2, 4]
}
```

**Ответ:** `204 No Content`

## Migration

Для применения изменений в базе данных выполните:

```bash
cd backend/TravelPlanner.Api
dotnet ef database update
```

