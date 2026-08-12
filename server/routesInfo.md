# BROKERS.ROUTER.JS /api/brokers

1) /getAll = получить список всех брокеров

# LEADS.ROUTER.JS /api/leads

1) /getAll = получить список всех лидов
2) /getByPhone = получить список лидов по номеру телефона
3) /getNullBrokerLeads = получить список лидов у которого нет брокера
4) /getByDate = получить лиды по дате

# MAILINGS.ROUTER.JS /api/mailings

1) /getAll = получить список всех активных расылок
2) /getAllFinished = получить список всех завершеных (finished stopped) расылок
3) /getFinishedByDate = получить завершеные расылки по дате
4) /getByDate = получить активные расылки по дате

# MINUSES.ROUTE.JS /api/minuses

1) /byDate = расчет минусов брокеров по дате

# TOKENS.ROUTER.JS /api/tokens

1) / = получить все токены из БД
2) /update = обновить токен в БД

# TRAFFIC.ROUTE.JS /api/traffic

1) getByDate = получить расчет трафика звонобота и общий (total) по дате