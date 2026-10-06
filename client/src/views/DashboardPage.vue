<template>
    <div v-loading="loading">
        <div class="stat-grid">
            <div class="stat-card"><div class="label">Лиды</div><div class="value">{{ stats.leads }}</div><div class="hint">Всего в базе</div></div>
            <div class="stat-card"><div class="label">Рассылки</div><div class="value">{{ stats.mailings }}</div><div class="hint">Активные записи</div></div>
            <div class="stat-card"><div class="label">Завершено</div><div class="value">{{ stats.finished }}</div><div class="hint">Архив рассылок</div></div>
            <div class="stat-card"><div class="label">Интеграции</div><div class="value">{{ stats.tokens }}</div><div class="hint">Настроенных сервисов</div></div>
        </div>

        <div class="page-grid">
            <section class="panel full-span">
                <div class="panel-header">
                    <div><h2>Быстрый старт</h2><p>Основные рабочие разделы сервиса</p></div>
                    <el-button :icon="Refresh" circle @click="loadStats" />
                </div>
                <div class="panel-body quick-grid">
                    <button v-for="item in sections" :key="item.path" class="quick-card" @click="$router.push(item.path)">
                        <span class="quick-icon"><el-icon><component :is="item.icon" /></el-icon></span>
                        <span><strong>{{ item.title }}</strong><small>{{ item.text }}</small></span>
                        <el-icon class="quick-arrow"><ArrowRight /></el-icon>
                    </button>
                </div>
            </section>
        </div>
    </div>
</template>

<script>
import { markRaw } from 'vue'
import { Refresh, User, Promotion, TrendCharts, Coin, Key } from '@element-plus/icons-vue'
import api, { getErrorMessage } from '../api.js'

export default {
    name: 'DashboardPage',
    data() {
        return {
            Refresh,
            loading: false,
            stats: { leads: 0, mailings: 0, finished: 0, tokens: 0 },
            sections: [
                { path: '/leads', title: 'Лиды', text: 'Найти и отфильтровать входы', icon: markRaw(User) },
                { path: '/mailings', title: 'Рассылки', text: 'Проверить кампании и статусы', icon: markRaw(Promotion) },
                { path: '/traffic', title: 'Трафик', text: 'Оценить конверсию и расходы', icon: markRaw(TrendCharts) },
                { path: '/minuses', title: 'Минусы', text: 'Посмотреть сводку по брокерам', icon: markRaw(Coin) },
                { path: '/tokens', title: 'Токены', text: 'Управлять интеграциями', icon: markRaw(Key) }
            ]
        }
    },
    methods: {
        async loadStats() {
            this.loading = true
            try {
                const [leads, mailings, finished, tokens] = await Promise.all([
                    api.get('/leads/getAll'), api.get('/mailings/getAll'), api.get('/mailings/getAllFinished'), api.get('/tokens')
                ])
                this.stats = {
                    leads: leads.data.data.length,
                    mailings: mailings.data.data.length,
                    finished: finished.data.data.length,
                    tokens: tokens.data.data.length
                }
            } catch (error) {
                this.$message.error(getErrorMessage(error))
            } finally {
                this.loading = false
            }
        }
    },
    mounted() { this.loadStats() }
}
</script>

<style scoped>
.quick-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 14px; }
.quick-card { min-height: 92px; padding: 16px; display: flex; align-items: center; gap: 14px; border: 1px solid #e7eaf0; border-radius: 14px; background: white; text-align: left; color: #172033; cursor: pointer; transition: .18s ease; }
.quick-card:hover { transform: translateY(-2px); border-color: #cfc6fa; box-shadow: 0 10px 24px #2f235c12; }
.quick-icon { flex: 0 0 44px; height: 44px; display: grid; place-items: center; border-radius: 12px; background: #f0edff; color: #7357e8; font-size: 20px; }
.quick-card > span:nth-child(2) { display: flex; flex: 1; flex-direction: column; gap: 5px; }
.quick-card small { color: #7c8494; }
.quick-arrow { color: #a7adba; }
@media (max-width: 900px) { .quick-grid { grid-template-columns: 1fr; } }
</style>
