# API Документация

## Базовая информация

- **Base URL**: `http://localhost:5000/api`
- **Авторизация**: Через заголовок `X-Telegram-Init-Data` или query параметр `initData`
- **Формат**: JSON

## Авторизация

Все запросы (кроме `/api/telegram/validate`) требуют авторизации через Telegram initData.

### В заголовке:
```
X-Telegram-Init-Data: <initData строка>
```

### В query параметре:
```
?initData=<initData строка>
```

### Dev режим

В режиме разработки (когда `ASPNETCORE_ENVIRONMENT=Development`) авторизация автоматически использует мок-пользователя из конфигурации.

## Endpoints

### 1. Валидация initData

#### `POST /api/telegram/validate`

Валидирует initData от Telegram.

**Request:**
```json
{
  "initData": "query_id=AAHdF6IQAAAAAN0XohDhrOrc&user=%7B%22id%22%3A279058397%2C%22first_name%22%3A%22Vladislav%22%2C%22last_name%22%3A%22Kibenko%22%2C%22username%22%3A%22vdkfrost%22%2C%22language_code%22%3A%22ru%22%7D&auth_date=1662771648&hash=c501b71e775f74ce10e377dea85a7ea24ecd640b00ea421001a85d6b0d072524"
}
```

**Response:**
```json
{
  "valid": true,
  "user": {
    "id": 279058397,
    "firstName": "Vladislav",
    "lastName": "Kibenko",
    "username": "vdkfrost",
    "photoUrl": null
  }
}
```

---

### 2. Поездки (Trips)

#### `GET /api/trips`

Получить список всех поездок текущего пользователя.

**Headers:**
```
X-Telegram-Init-Data: <initData>
```

**Response:**
```json
[
  {
    "id": 1,
    "title": "Поездка в Париж",
    "startDate": "2024-06-01T00:00:00Z",
    "endDate": "2024-06-07T00:00:00Z",
    "ownerId": 1,
    "ownerName": "Иван Иванов",
    "role": 1,
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z",
    "members": [
      {
        "userId": 1,
        "name": "Иван Иванов",
        "avatar": "https://example.com/avatar.jpg",
        "role": 1
      },
      {
        "userId": 2,
        "name": "Мария Петрова",
        "avatar": null,
        "role": 2
      }
    ]
  }
]
```

**Роли:**
- `1` - Owner (владелец)
- `2` - Editor (редактор)
- `3` - Viewer (наблюдатель)

---

#### `GET /api/trips/{id}`

Получить детали поездки.

**Headers:**
```
X-Telegram-Init-Data: <initData>
```

**Response:**
```json
{
  "id": 1,
  "title": "Поездка в Париж",
  "startDate": "2024-06-01T00:00:00Z",
  "endDate": "2024-06-07T00:00:00Z",
  "ownerId": 1,
  "ownerName": "Иван Иванов",
  "role": 1,
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z",
  "members": [...]
}
```

**Ошибки:**
- `404` - Поездка не найдена
- `403` - Пользователь не является участником

---

#### `POST /api/trips`

Создать новую поездку.

**Headers:**
```
X-Telegram-Init-Data: <initData>
```

**Request:**
```json
{
  "title": "Поездка в Париж",
  "startDate": "2024-06-01T00:00:00Z",
  "endDate": "2024-06-07T00:00:00Z"
}
```

**Response:**
```json
{
  "id": 1,
  "title": "Поездка в Париж",
  "startDate": "2024-06-01T00:00:00Z",
  "endDate": "2024-06-07T00:00:00Z",
  "ownerId": 1,
  "ownerName": "Иван Иванов",
  "role": 1,
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z",
  "members": [...]
}
```

**Status Code:** `201 Created`

---

#### `PUT /api/trips/{tripId}/members/role`

Изменить роль участника поездки. Только для владельца (owner).

**Headers:**
```
X-Telegram-Init-Data: <initData>
```

**Request:**
```json
{
  "userId": 2,
  "role": 2
}
```

**Роли:**
- `1` - Owner
- `2` - Editor
- `3` - Viewer

**Response:** `204 No Content`

**Ошибки:**
- `403` - Только owner может изменить роль
- `400` - Нельзя изменить роль owner
- `404` - Пользователь не найден в поездке

---

### 3. Приглашения (Invites)

#### `POST /api/invites`

Создать приглашение для поездки.

**Headers:**
```
X-Telegram-Init-Data: <initData>
```

**Request:**
```json
{
  "tripId": 1,
  "expiresAt": "2024-01-15T00:00:00Z"
}
```

**Response:**
```json
{
  "token": "abc123def456ghi789jkl012mno345pq",
  "expiresAt": "2024-01-15T00:00:00Z"
}
```

**Примечание:** Только owner и editor могут создавать приглашения.

---

#### `POST /api/invites/join`

Присоединиться к поездке по токену приглашения.

**Headers:**
```
X-Telegram-Init-Data: <initData>
```

**Request:**
```json
{
  "token": "abc123def456ghi789jkl012mno345pq"
}
```

**Response:**
```json
{
  "id": 1,
  "title": "Поездка в Париж",
  "startDate": "2024-06-01T00:00:00Z",
  "endDate": "2024-06-07T00:00:00Z",
  "ownerId": 1,
  "ownerName": "Иван Иванов",
  "role": 3,
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z",
  "members": [...]
}
```

**Ошибки:**
- `404` - Приглашение не найдено или уже использовано
- `400` - Приглашение истекло или пользователь уже участник

---

## Примеры запросов

### cURL

#### Создать поездку
```bash
curl -X POST http://localhost:5000/api/trips \
  -H "Content-Type: application/json" \
  -H "X-Telegram-Init-Data: <initData>" \
  -d '{
    "title": "Поездка в Париж",
    "startDate": "2024-06-01T00:00:00Z",
    "endDate": "2024-06-07T00:00:00Z"
  }'
```

#### Получить мои поездки
```bash
curl -X GET http://localhost:5000/api/trips \
  -H "X-Telegram-Init-Data: <initData>"
```

#### Создать приглашение
```bash
curl -X POST http://localhost:5000/api/invites \
  -H "Content-Type: application/json" \
  -H "X-Telegram-Init-Data: <initData>" \
  -d '{
    "tripId": 1,
    "expiresAt": "2024-01-15T00:00:00Z"
  }'
```

#### Присоединиться к поездке
```bash
curl -X POST http://localhost:5000/api/invites/join \
  -H "Content-Type: application/json" \
  -H "X-Telegram-Init-Data: <initData>" \
  -d '{
    "token": "abc123def456ghi789jkl012mno345pq"
  }'
```

### JavaScript (fetch)

```javascript
// Создать поездку
const createTrip = async (initData) => {
  const response = await fetch('http://localhost:5000/api/trips', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Telegram-Init-Data': initData
    },
    body: JSON.stringify({
      title: 'Поездка в Париж',
      startDate: '2024-06-01T00:00:00Z',
      endDate: '2024-06-07T00:00:00Z'
    })
  });
  return await response.json();
};

// Получить мои поездки
const getMyTrips = async (initData) => {
  const response = await fetch('http://localhost:5000/api/trips', {
    headers: {
      'X-Telegram-Init-Data': initData
    }
  });
  return await response.json();
};
```

---

## Коды ошибок

- `400 Bad Request` - Неверный формат запроса
- `401 Unauthorized` - Не авторизован
- `403 Forbidden` - Нет доступа к ресурсу
- `404 Not Found` - Ресурс не найден
- `500 Internal Server Error` - Внутренняя ошибка сервера

