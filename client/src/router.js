import { createRouter, createWebHistory } from 'vue-router'

import DashboardPage from './views/DashboardPage.vue'
import TokensPage from './views/TokensPage.vue'
import LeadsPage from './views/LeadsPage.vue'
import MailingsPage from './views/MailingsPage.vue'
import TrafficPage from './views/TrafficPage.vue'
import MinusesPage from './views/MinusesPage.vue'

const routes = [
    { path: '/', component: DashboardPage, meta: { title: 'Обзор', subtitle: 'Состояние сервиса и быстрые действия' } },
    { path: '/tokens', component: TokensPage, meta: { title: 'Токены', subtitle: 'Управление ключами интеграций' } },
    { path: '/leads', component: LeadsPage, meta: { title: 'Лиды', subtitle: 'Поиск, фильтрация и контроль входов' } },
    { path: '/mailings', component: MailingsPage, meta: { title: 'Рассылки', subtitle: 'Активные и завершённые кампании' } },
    { path: '/traffic', component: TrafficPage, meta: { title: 'Трафик', subtitle: 'Экономика и конверсия по брокерам' } },
    { path: '/minuses', component: MinusesPage, meta: { title: 'Минусы', subtitle: 'Сводка удержаний и расходов' } },
    { path: '/:pathMatch(.*)*', redirect: '/' }
]

export default createRouter({
    history: createWebHistory(),
    routes
})
