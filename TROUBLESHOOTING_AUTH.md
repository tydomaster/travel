# Устранение ошибки авторизации

## Ошибка: "Не удалось авторизоваться. Убедитесь, что вы открыли приложение через Telegram Mini App."

### Возможные причины:

1. **`BotSecretKey` не настроен в Railway**
2. **`initData` не передается с фронтенда**
3. **Валидация `initData` не проходит**

## Шаг 1: Проверьте `BotSecretKey` в Railway

1. Откройте [Railway Dashboard](https://railway.app)
2. Выберите проект → сервис с бэкендом
3. Перейдите в **Variables**
4. Проверьте, что есть переменная `Telegram__BotSecretKey`
5. **Важно:** Это должен быть **Secret Key**, а не Bot Token!

### Как получить Secret Key:

1. Откройте [@BotFather](https://t.me/BotFather) в Telegram
2. Отправьте `/setdomain`
3. Выберите вашего бота
4. Укажите домен вашего Railway приложения (например: `trav-production.up.railway.app`)
5. @BotFather выдаст вам **Secret Key** (длинная строка)
6. Скопируйте его и установите в Railway как `Telegram__BotSecretKey`

### Формат переменной в Railway:

```
Telegram__BotSecretKey=<secret_key_из_@BotFather>
```

**НЕ используйте Bot Token!** Secret Key получается только через `/setdomain`.

## Шаг 2: Проверьте логи Railway

1. В Railway Dashboard → **Deployments** → выберите последний деплой
2. Откройте **Logs**
3. Ищите строки с:
   - `Auth check - Path: ...`
   - `HasInitData: ...`
   - `Validating initData - HasSecretKey: ...`
   - `InitData validation result: ...`

### Что искать в логах:

- ✅ `HasInitData: True` - `initData` передается
- ❌ `HasInitData: False` - `initData` не передается (проблема на фронтенде)
- ✅ `HasSecretKey: True` - Secret Key настроен
- ❌ `HasSecretKey: False` - Secret Key не настроен (проблема в Railway)
- ✅ `InitData validation result: True` - валидация прошла
- ❌ `InitData validation result: False` - валидация не прошла (неправильный Secret Key)

## Шаг 3: Проверьте фронтенд (консоль браузера)

1. Откройте Mini App в Telegram
2. Откройте консоль браузера (в Telegram: Settings → Advanced → WebView Debug)
3. Ищите логи:
   - `getInitData: Found initData for user: ...` - ✅ `initData` есть
   - `getInitData: Telegram WebApp not available` - ❌ Telegram WebApp не инициализирован
   - `getInitData: Found initData but no user data` - ❌ `initData` поврежден

### Проверка в консоли:

Выполните в консоли браузера:
```javascript
console.log('Telegram available:', typeof window.Telegram !== 'undefined')
console.log('WebApp available:', typeof window.Telegram?.WebApp !== 'undefined')
console.log('initData:', window.Telegram?.WebApp?.initData)
```

**Ожидаемый результат:**
- `Telegram available: true`
- `WebApp available: true`
- `initData: "query_id=...&user=..."` (длинная строка)

## Шаг 4: Проверьте Web App URL в @BotFather

1. Откройте [@BotFather](https://t.me/BotFather)
2. Отправьте `/myapps`
3. Выберите вашего бота
4. Проверьте **Web App URL** - должен быть URL вашего Vercel приложения (например: `https://your-app.vercel.app`)
5. Убедитесь, что URL правильный и доступен

## Шаг 5: Перезапустите сервисы

После изменения `BotSecretKey` в Railway:

1. **Railway:** Перейдите в **Deployments** → **Redeploy**
2. **Vercel:** Перейдите в **Deployments** → последний деплой → **Redeploy**

## Частые ошибки:

### ❌ "HasSecretKey: False"
**Решение:** Установите `Telegram__BotSecretKey` в Railway (см. Шаг 1)

### ❌ "HasInitData: False"
**Решение:** 
- Проверьте, что открываете приложение через Telegram Mini App (не в обычном браузере)
- Проверьте, что Web App URL правильный в @BotFather
- Проверьте консоль браузера (см. Шаг 3)

### ❌ "InitData validation result: False"
**Решение:**
- Убедитесь, что используете **Secret Key** (из `/setdomain`), а не Bot Token
- Проверьте, что Secret Key правильный (скопируйте заново из @BotFather)
- Убедитесь, что домен в `/setdomain` совпадает с Railway URL

### ❌ "Telegram WebApp not available"
**Решение:**
- Откройте приложение через Telegram Mini App (не в обычном браузере)
- Проверьте, что Web App URL правильный в @BotFather
- Убедитесь, что приложение задеплоено на Vercel

## Проверка работы:

После исправления:
1. Откройте Mini App в Telegram
2. Проверьте логи Railway - должны быть строки `Authenticating user with TelegramId: ...`
3. Приложение должно загрузиться без ошибок авторизации

