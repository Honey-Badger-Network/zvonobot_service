# MASTERCRONS.JS (ОСНОВНАЯ ЛОГИКА АЛГОРИТМ)

1) получить токены для zvonobot и residence
2) получить список активных расылок из zvonobot
3) получить список брокеров и список лидов и звонков из residence
4) получить список звонков из envyBoxService

5) дальше идет перебор расылок из zvonobot
6) получить общую информацию о расылки
7) обновить информацию о расылки в БД (если статус finished stopped) то обновить и в модели finishedMailings
8) перебор лидов из каждой расылки
9) получить из envyBox такую информацию после find

# lead.stageCode = код звонка (новый или база)
# lead.stagePrice = цена за звонок (если новый то 10 если старый то 5)
# lead.stage = код звонка (string пояснение)
# lead.envyCallId = айдишник записи из envyBox
# lead.isFoundInEnvy = boolean найден ли этот звонов в envyBox

10) получить такую информацию из residence после find

# lead.broker = брокер
# lead.isResidence = boolean найден ли в резиденции (в лидах/звонках)
# lead.statuses = статусы лида телефона из zvonobot (сопоставление)
# lead.offerPrice = price.offer если это Hold/confirmed/refused

11) переобновить даные о лидах каждом в БД