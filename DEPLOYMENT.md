# Инструкция по деплою в Production

## Быстрый деплой для тестирования

### Вариант 1: Vercel (фронтенд) + Railway/Render (бэкенд) - Рекомендуется

#### Шаг 1: Подготовка Telegram Bot

1. Откройте [@BotFather](https://t.me/BotFather) в Telegram
2. Создайте нового бота или используйте существующего:
   ```
   /newbot
   ```
3. Сохраните **Bot Token** (например: `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`)
4. Получите **Secret Key**:
   ```
   /newapp
   ```
   Выберите вашего бота и следуйте инструкциям. Сохраните **Secret Key**.

#### Шаг 2: Деплой бэкенда (Railway - бесплатный тариф)

1. Зарегистрируйтесь на [Railway.app](https://railway.app) (можно через GitHub)
2. Создайте новый проект → "Deploy from GitHub repo"
3. Выберите репозиторий и папку `backend/TravelPlanner.Api`
4. Railway автоматически определит .NET проект
5. Добавьте переменные окружения:
   - `ASPNETCORE_ENVIRONMENT=Production`
   - `ConnectionStrings__DefaultConnection=Data Source=/app/data/travelplanner.db` (или используйте PostgreSQL)
   - `Telegram__BotSecretKey=<ваш_secret_key>`
6. Railway автоматически запустит приложение
7. Скопируйте URL (например: `https://your-app.railway.app`)

**Альтернатива: Render.com**
- Аналогично Railway, но может потребоваться Dockerfile

#### Шаг 3: Деплой фронтенда (Vercel)

1. Зарегистрируйтесь на [Vercel](https://vercel.com) (можно через GitHub)
2. Импортируйте репозиторий
3. Настройки:
   - **Framework Preset**: Next.js
   - **Root Directory**: `.` (корень проекта)
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
4. Добавьте переменные окружения:
   - `NEXT_PUBLIC_API_URL=https://your-app.railway.app` (URL вашего бэкенда)
   - `NEXT_PUBLIC_TELEGRAM_BOT_USERNAME=your_bot_username` (без @)
   - `NEXT_PUBLIC_TELEGRAM_APP_NAME=travel-planner` (или другое имя)
5. Деплой
6. Скопируйте URL (например: `https://your-app.vercel.app`)

#### Шаг 4: Настройка Telegram Mini App

1. Откройте [@BotFather](https://t.me/BotFather)
2. Выберите вашего бота
3. Отправьте:
   ```
   /newapp
   ```
4. Выберите бота
5. Укажите:
   - **Title**: Travel Planner
   - **Description**: Планировщик поездок
   - **Photo**: (опционально)
   - **Web App URL**: `https://your-app.vercel.app`
   - **Short name**: `travel-planner` (или другое)
6. Сохраните полученный **Secret Key** (если еще не сохранили)

#### Шаг 5: Обновление конфигурации

1. В Vercel обновите переменные окружения:
   - `NEXT_PUBLIC_TELEGRAM_BOT_USERNAME` - имя вашего бота (без @)
   - `NEXT_PUBLIC_TELEGRAM_APP_NAME` - short name из шага 4

2. В Railway обновите:
   - `Telegram__BotSecretKey` - Secret Key из шага 4

3. Перезапустите оба сервиса

### Вариант 2: Все на одном сервере (VPS)

Если у вас есть VPS (например, DigitalOcean, Hetzner):

1. **Установите .NET 8 SDK**:
   ```bash
   wget https://dot.net/v1/dotnet-install.sh
   bash dotnet-install.sh --channel 8.0
   ```

2. **Установите Node.js 18+**:
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

3. **Клонируйте репозиторий**:
   ```bash
   git clone <your-repo>
   cd trav2
   ```

4. **Настройте бэкенд**:
   ```bash
   cd backend/TravelPlanner.Api
   # Создайте appsettings.Production.json
   nano appsettings.Production.json
   ```
   ```json
   {
     "ConnectionStrings": {
       "DefaultConnection": "Data Source=/var/app/travelplanner.db"
     },
     "Telegram": {
       "BotSecretKey": "<ваш_secret_key>"
     }
   }
   ```

5. **Запустите бэкенд через systemd**:
   ```bash
   sudo nano /etc/systemd/system/travelplanner-api.service
   ```
   ```ini
   [Unit]
   Description=Travel Planner API
   After=network.target

   [Service]
   Type=notify
   WorkingDirectory=/path/to/trav2/backend/TravelPlanner.Api
   ExecStart=/usr/bin/dotnet run --environment Production
   Restart=always
   RestartSec=10
   Environment=ASPNETCORE_URLS=http://localhost:5000

   [Install]
   WantedBy=multi-user.target
   ```
   ```bash
   sudo systemctl enable travelplanner-api
   sudo systemctl start travelplanner-api
   ```

6. **Настройте Nginx как reverse proxy**:
   ```bash
   sudo apt install nginx
   sudo nano /etc/nginx/sites-available/travelplanner
   ```
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       # Backend API
       location /api {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection keep-alive;
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }

       # Frontend (Next.js)
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```
   ```bash
   sudo ln -s /etc/nginx/sites-available/travelplanner /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

7. **Настройте SSL через Let's Encrypt**:
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d your-domain.com
   ```

8. **Соберите и запустите фронтенд**:
   ```bash
   cd /path/to/trav2
   npm install
   npm run build
   # Создайте .env.production
   echo "NEXT_PUBLIC_API_URL=https://your-domain.com/api" > .env.production
   echo "NEXT_PUBLIC_TELEGRAM_BOT_USERNAME=your_bot_username" >> .env.production
   echo "NEXT_PUBLIC_TELEGRAM_APP_NAME=travel-planner" >> .env.production
   # Запустите через PM2
   npm install -g pm2
   pm2 start npm --name "travelplanner-frontend" -- start
   pm2 save
   pm2 startup
   ```

## Проверка работы

1. Откройте Telegram
2. Найдите вашего бота
3. Нажмите на кнопку "Open App" или отправьте команду `/start`
4. Приложение должно открыться в Mini App

## Важные замечания

1. **HTTPS обязателен** - Telegram требует HTTPS для Web Apps
2. **Bot Secret Key** - храните в секрете, не коммитьте в Git
3. **База данных** - для production лучше использовать PostgreSQL вместо SQLite
4. **CORS** - уже настроен для работы с Telegram (AllowAnyOrigin)

## Переход на PostgreSQL (опционально)

Для production рекомендуется PostgreSQL:

1. Установите пакет:
   ```bash
   cd backend/TravelPlanner.Api
   dotnet add package Npgsql.EntityFrameworkCore.PostgreSQL
   ```

2. Обновите `Program.cs`:
   ```csharp
   builder.Services.AddDbContext<ApplicationDbContext>(options =>
       options.UseNpgsql(connectionString));
   ```

3. Обновите connection string:
   ```
   ConnectionStrings__DefaultConnection=Host=localhost;Database=travelplanner;Username=postgres;Password=password
   ```

## Troubleshooting

### Ошибка "Unauthorized"
- Проверьте, что `Telegram__BotSecretKey` установлен правильно
- Убедитесь, что приложение открыто через Telegram Mini App
- Проверьте логи бэкенда

### CORS ошибки
- Убедитесь, что используется политика `TelegramWebApp` (AllowAnyOrigin)
- Проверьте, что бэкенд доступен по HTTPS

### База данных не создается
- Проверьте права доступа к файлу/директории базы данных
- Убедитесь, что миграции применены: `dotnet ef database update`

