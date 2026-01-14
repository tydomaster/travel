# Проблема: Railway не передает переменные окружения в контейнер

## Проблема
Переменные установлены в Railway, но не передаются в контейнер (`No Telegram environment variables found at startup!`).

## Решение 1: Проверьте, что переменные применены к деплою

1. Railway Dashboard → ваш сервис → **Deployments**
2. Найдите последний деплой
3. Откройте его → **Details**
4. Проверьте раздел **"Variables"** - там должно быть больше 0
5. Если там "0 Variables" - переменные не применены к этому деплою

### Как применить переменные к деплою:

1. Railway Dashboard → сервис → **Variables**
2. Убедитесь, что переменные есть
3. **Удалите последний деплой** (если он был создан до добавления переменных)
4. Создайте **новый деплой**:
   - Railway Dashboard → **Deployments** → **"Deploy"** или **"Redeploy"**
   - Или сделайте push в GitHub - Railway создаст новый деплой с переменными

## Решение 2: Используйте Railway CLI

Если веб-интерфейс не работает, попробуйте через CLI:

```bash
# Установите Railway CLI
npm i -g @railway/cli

# Войдите
railway login

# Выберите проект
railway link

# Установите переменную
railway variables set Telegram__BotToken="ваш_bot_token"

# Перезапустите
railway up
```

## Решение 3: Временное решение - используйте appsettings.Production.json

**⚠️ ВНИМАНИЕ: Это небезопасно для production! Используйте только для тестирования.**

1. Откройте `backend/TravelPlanner.Api/appsettings.Production.json`
2. Добавьте Bot Token напрямую:
   ```json
   {
     "Telegram": {
       "BotToken": "ваш_bot_token_здесь"
     }
   }
   ```
3. Закоммитьте и запушьте в GitHub
4. Railway автоматически задеплоит

**⚠️ НЕ ДЕЛАЙТЕ ЭТО В PRODUCTION!** Bot Token будет в коде, что небезопасно.

## Решение 4: Проверьте настройки сервиса

1. Railway Dashboard → сервис → **Settings**
2. Проверьте раздел **"Environment"**
3. Убедитесь, что переменные там указаны
4. Попробуйте пересоздать сервис

## Решение 5: Используйте другой способ деплоя

Если ничего не помогает, попробуйте:
1. Удалите текущий сервис
2. Создайте новый сервис
3. Добавьте переменные
4. Задеплойте заново

## Проверка

После применения переменных проверьте логи:
- ✅ Должно быть: `Telegram environment variables at startup: Telegram__BotToken=***SET***`
- ❌ Не должно быть: `No Telegram environment variables found at startup!`

