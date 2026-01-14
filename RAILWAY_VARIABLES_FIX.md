# Исправление переменных окружения в Railway

## Проблема

В Railway переменная указана как `Telegram_BotToken` (одно подчеркивание), но .NET Core требует **двойное подчеркивание** `__` для вложенных ключей конфигурации.

## Решение

### Шаг 1: Удалите старые переменные

В Railway Dashboard → Variables:
1. Удалите `Telegram_BotToken` (одно подчеркивание)
2. Удалите `Telegram_BotSecretKey` (если есть, одно подчеркивание)

### Шаг 2: Добавьте правильные переменные

Нажмите **"+ New Variable"** и добавьте:

**Переменная 1:**
- **Key**: `Telegram__BotToken` (двойное подчеркивание `__`)
- **Value**: `<ваш_bot_token>` (из @BotFather)

**Переменная 2 (опционально, для обратной совместимости):**
- **Key**: `Telegram__BotSecretKey` (двойное подчеркивание `__`)
- **Value**: можно оставить пустым или удалить

### Шаг 3: Перезапустите Railway

1. Railway Dashboard → **Deployments**
2. Нажмите **Redeploy** или подождите автоматического перезапуска

## Важно: Формат переменных в .NET

В .NET Core переменные окружения с двойным подчеркиванием `__` преобразуются в вложенные ключи:

- `Telegram__BotToken` → `Telegram:BotToken` в конфигурации
- `Telegram_BotToken` → `Telegram_BotToken` (не работает для вложенных ключей)

## Проверка

После перезапуска проверьте логи Railway. Должно быть:
- ✅ `HasBotToken: True`
- ✅ `Using HASH validation (bot token)`
- ✅ `HASH validation result: True`

## Где взять Bot Token

1. Откройте [@BotFather](https://t.me/BotFather) в Telegram
2. Отправьте `/mybots`
3. Выберите вашего бота (`@travelrustikbot`)
4. Выберите **"API Token"**
5. Скопируйте токен (формат: `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`)

