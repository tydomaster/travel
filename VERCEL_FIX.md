# Исправление URL в Vercel

## Проблема
В `NEXT_PUBLIC_API_URL` отсутствует протокол `https://`

## Текущее значение (неправильно):
```
trav-production.up.railway.app
```

## Правильное значение:
```
https://trav-production.up.railway.app
```

## Как исправить:

1. Откройте Vercel Dashboard → ваш проект → Settings → Environment Variables
2. Найдите `NEXT_PUBLIC_API_URL`
3. Нажмите на три точки (⋮) → Edit
4. Измените значение на: `https://trav-production.up.railway.app`
5. Сохраните
6. Перезапустите деплой: Deployments → последний → Redeploy

## Проверка Railway URL:

Откройте в браузере: `https://trav-production.up.railway.app/swagger`

Если открывается Swagger UI — URL правильный, просто нужно добавить `https://` в Vercel.

