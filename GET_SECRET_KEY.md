# Как получить Secret Key для Telegram Mini App

## Важно: `/setdomain` НЕ дает Secret Key!

`/setdomain` используется для **Login Widget** (веб-авторизация), а не для Mini Apps.

## Правильный способ получения Secret Key:

### Вариант 1: Если Mini App уже создан (ваш случай)

1. Откройте [@BotFather](https://t.me/BotFather) в Telegram
2. Отправьте `/myapps`
3. Выберите вашего бота (`@travelrustikbot`)
4. Выберите ваше приложение (`mvptravelrust`)
5. @BotFather покажет информацию о приложении, включая **Secret Key**

### Вариант 2: Если нужно создать новое Mini App

1. Откройте [@BotFather](https://t.me/BotFather)
2. Отправьте `/newapp`
3. Выберите вашего бота
4. Заполните форму:
   - **Title**: Travel Planner (или любое название)
   - **Description**: Планировщик групповых поездок
   - **Photo**: Загрузите иконку (опционально, 640x360px)
   - **Web App URL**: `https://your-vercel-url.vercel.app` (URL вашего фронтенда)
   - **Short name**: `mvptravelrust` (или другое имя)
5. @BotFather выдаст вам **Secret Key** (длинная строка)
6. **Сохраните Secret Key!** Он показывается только один раз

### Вариант 3: Редактировать существующее приложение

1. Откройте [@BotFather](https://t.me/BotFather)
2. Отправьте `/myapps`
3. Выберите вашего бота
4. Выберите приложение (`mvptravelrust`)
5. Отправьте `/editapp` или выберите "Edit App"
6. Выберите опцию для просмотра Secret Key
7. @BotFather покажет Secret Key

## Что делать с Secret Key:

1. Скопируйте Secret Key (длинная строка, например: `1234567890:ABCdefGHIjklMNOpqrsTUVwxyz...`)
2. Откройте [Railway Dashboard](https://railway.app)
3. Выберите проект → сервис с бэкендом
4. Перейдите в **Variables**
5. Добавьте или обновите переменную:
   - **Key**: `Telegram__BotSecretKey`
   - **Value**: `<ваш_secret_key>` (вставьте скопированный Secret Key)
6. Сохраните
7. Перезапустите деплой: **Deployments** → **Redeploy**

## Формат Secret Key:

Secret Key выглядит примерно так:
```
1234567890:ABCdefGHIjklMNOpqrsTUVwxyz1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ
```

Это **НЕ** Bot Token! Bot Token получается через `/newbot`, а Secret Key — через `/newapp` или `/editapp`.

## Проверка:

После установки Secret Key в Railway:
1. Проверьте логи Railway — должны быть строки `HasSecretKey: True`
2. Откройте Mini App в Telegram
3. Ошибка авторизации должна исчезнуть

## Важно:

- ⚠️ Secret Key показывается **только один раз** при создании приложения
- ⚠️ Если потеряли Secret Key, нужно создать новое приложение через `/newapp`
- ⚠️ Secret Key отличается от Bot Token
- ✅ Secret Key нужен для валидации `initData` на бэкенде

