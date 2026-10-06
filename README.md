# Zvonobot Service

Сервис аналитики звонков и рассылок: Express/MongoDB API и единая панель управления на Vue 3 + Element Plus. Фронтенд написан на Options API.

## Локальная разработка

Установите зависимости:

```bash
npm install

cd server
npm install

cd ../client
npm install

cd ..
```

Запустите backend и frontend одной командой из корня проекта:

```bash
npm run dev
```

Vite откроет интерфейс на `http://localhost:8000`, а backend будет работать на `http://localhost:9000`. Запросы `/api` проксируются настройкой `client/vite.config.js`. Там рядом оставлен закомментированный production-адрес: для переключения достаточно поменять комментарий у `API_PROXY_TARGET`.

## Production-сборка без Docker

```bash
npm run build:client
npm start
```

После сборки Express отдаёт интерфейс и API на `http://localhost:9000`.

## Docker

Соберите образ из корня репозитория:

```bash
docker build --no-cache -t zvonobot-service .
```

Запустите контейнер, передав серверные переменные из `server/.env`:

```bash
docker run --name zvonobot-service --restart unless-stopped --env-file server/.env -p 9000:9000 zvonobot-service
```

Приложение будет доступно на `http://localhost:9000`. Один контейнер запускает backend и раздаёт собранный frontend.

После изменения зависимостей удалите старый контейнер, пересоберите образ командой выше и создайте контейнер заново:

```bash
docker rm -f zvonobot-service
docker run --name zvonobot-service --restart unless-stopped --env-file server/.env -p 9000:9000 zvonobot-service
```

Для повторного запуска уже созданного контейнера:

```bash
docker start zvonobot-service
```
