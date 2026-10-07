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
docker build -t webcoder2/zvonobot2 .
docker push webcoder2/zvonobot2
```

Запустите контейнер, передав серверные переменные из `server/.env`:

```bash
docker rm -f zvonobot2
docker pull webcoder2/zvonobot2
docker run --name zvonobot2 -p 9000:9000 webcoder2/zvonobot2
```

Приложение будет доступно на `http://localhost:9000`. Один контейнер запускает backend и раздаёт собранный frontend.

Для повторного запуска уже созданного контейнера:

```bash
docker start zvonobot-service
```
