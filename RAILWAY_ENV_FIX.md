# Исправление проблемы с переменными окружения в Railway

## Проблема
Переменные `Telegram__BotToken` установлены в Railway, но не передаются в контейнер (`No Telegram environment variables found!`).

## Решение

### Вариант 1: Проверьте, что переменные применены к сервису (не только к проекту)

1. **Откройте Railway Dashboard**
2. **Выберите ПРОЕКТ** (не сервис)
3. Перейдите в **Settings** → **Variables**
4. Проверьте, есть ли там `Telegram__BotToken`
5. Если есть — **удалите** оттуда (переменные проекта не всегда передаются в сервисы)

6. **Выберите СЕРВИС** (ваш бэкенд, например "trav")
7. Перейдите в **Variables** (внутри сервиса)
8. Убедитесь, что `Telegram__BotToken` есть **именно здесь**
9. Если нет — создайте:
   - **Key**: `Telegram__BotToken` (двойное подчеркивание)
   - **Value**: `<ваш_bot_token>`

### Вариант 2: Используйте Raw Editor

1. Railway Dashboard → сервис → **Variables**
2. Нажмите **"Raw Editor"** (иконка `{}`)
3. Убедитесь, что там есть:
   ```json
   {
     "Telegram__BotToken": "ваш_bot_token_здесь"
   }
   ```
4. Сохраните

### Вариант 3: Пересоздайте переменную

1. Railway Dashboard → сервис → **Variables**
2. Найдите `Telegram__BotToken`
3. Нажмите на три точки (⋮) → **Delete**
4. Нажмите **"+ New Variable"**
5. Добавьте:
   - **Key**: `Telegram__BotToken` (точно с двойным подчеркиванием)
   - **Value**: `<ваш_bot_token>`
6. Сохраните

### Вариант 4: Проверьте через Railway CLI

Если у вас установлен Railway CLI:
```bash
railway variables
```

Должны увидеть `Telegram__BotToken`.

## После изменений:

1. **Обязательно перезапустите сервис:**
   - Railway Dashboard → **Deployments** → **Redeploy**
   - Или удалите последний деплой и создайте новый

2. **Проверьте логи:**
   - Должно быть: `All Telegram environment variables: Telegram__BotToken=***`
   - Не должно быть: `No Telegram environment variables found!`

## Важно:

- ✅ Переменные должны быть **внутри сервиса**, а не только в проекте
- ✅ Имя должно быть `Telegram__BotToken` (двойное подчеркивание `__`)
- ✅ Значение не должно быть пустым
- ✅ После изменения переменных **обязательно перезапустите** сервис

## Если все еще не работает:

Попробуйте добавить переменную через Railway CLI:
```bash
railway variables set Telegram__BotToken="ваш_bot_token" --service ваш_сервис
```

