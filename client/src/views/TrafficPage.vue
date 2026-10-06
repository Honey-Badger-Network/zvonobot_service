<template>
    <section class="panel filter-panel">
        <div class="panel-body toolbar">
            <div class="field"><span class="field-label">Начало периода</span><el-date-picker v-model="gte" type="date" value-format="YYYY-MM-DD" format="DD.MM.YYYY" /></div>
            <div class="field"><span class="field-label">Конец периода</span><el-date-picker v-model="lte" type="date" value-format="YYYY-MM-DD" format="DD.MM.YYYY" /></div>
            <el-button type="primary" :icon="Search" :loading="loading" @click="loadTraffic">Рассчитать</el-button>
        </div>
    </section>

    <template v-if="total">
        <div class="stat-grid traffic-stats">
            <div class="stat-card"><div class="label">Звонки</div><div class="value">{{ number(total.calls.count) }}</div><div class="hint">Расход: {{ money(total.calls.spent) }}</div></div>
            <div class="stat-card"><div class="label">Входы</div><div class="value">{{ number(total.inputs.count) }}</div><div class="hint">{{ total.inputs.percent }}% · {{ money(total.inputs.spent) }} за вход</div></div>
            <div class="stat-card"><div class="label">Переводы</div><div class="value">{{ number(total.leads.count) }}</div><div class="hint">{{ total.leads.percent }}% · {{ money(total.leads.spent) }} за перевод</div></div>
            <div class="stat-card"><div class="label">Холды</div><div class="value">{{ number(total.holds.count) }}</div><div class="hint">{{ total.holds.percent }}% · {{ money(total.holds.spent) }} за холд</div></div>
        </div>

        <section class="panel result-panel">
            <div class="result-block"><span>Общий результат</span><strong :class="moneyClass(total.result.total)">{{ money(total.result.total) }}</strong></div>
            <div class="result-divider"></div>
            <div class="result-block"><span>Результат трафика</span><strong :class="moneyClass(total.result.traffic)">{{ money(total.result.traffic) }}</strong></div>
        </section>

        <section class="panel">
            <div class="panel-header"><div><h2>Результаты брокеров</h2><p>{{ brokers.length }} сотрудников за период</p></div></div>
            <div class="table-wrap">
                <el-table :data="brokers" empty-text="Нет данных">
                    <el-table-column prop="broker" label="Брокер" min-width="180" fixed />
                    <el-table-column label="Входы" width="110" align="right"><template #default="scope">{{ scope.row.inputs.count }}</template></el-table-column>
                    <el-table-column label="Доля входов" width="120" align="right"><template #default="scope">{{ scope.row.inputs.percent }}%</template></el-table-column>
                    <el-table-column label="Переводы" width="110" align="right"><template #default="scope">{{ scope.row.leads.count }}</template></el-table-column>
                    <el-table-column label="Холды" width="95" align="right"><template #default="scope">{{ scope.row.holds.count }}</template></el-table-column>
                    <el-table-column prop="offerPrice" label="Оффер" width="120" align="right"><template #default="scope">{{ money(scope.row.offerPrice) }}</template></el-table-column>
                    <el-table-column label="Результат" width="140" align="right"><template #default="scope"><span :class="moneyClass(scope.row.result.total)">{{ money(scope.row.result.total) }}</span></template></el-table-column>
                    <el-table-column label="Трафик" width="140" align="right"><template #default="scope"><span :class="moneyClass(scope.row.result.traffic)">{{ money(scope.row.result.traffic) }}</span></template></el-table-column>
                </el-table>
            </div>
        </section>
    </template>
    <div v-else-if="!loading" class="panel empty-state">Выберите период и запустите расчёт трафика</div>
</template>

<script>
import dayjs from 'dayjs'
import { Search } from '@element-plus/icons-vue'
import api, { getErrorMessage } from '../api.js'

export default {
    name: 'TrafficPage',
    data() { return { Search, gte: dayjs().format('YYYY-MM-DD'), lte: dayjs().format('YYYY-MM-DD'), loading: false, total: null, brokers: [] } },
    methods: {
        number(value) { return new Intl.NumberFormat('ru-RU').format(Number(value) || 0) },
        money(value) { return `${new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 0 }).format(Number(value) || 0)} ₽` },
        moneyClass(value) { return Number(value) >= 0 ? 'money-positive' : 'money-negative' },
        async loadTraffic() {
            this.loading = true
            try {
                const response = await api.get('/traffic/getByDate', { params: { gte: this.gte, lte: this.lte } })
                this.total = response.data.data.total
                this.brokers = response.data.data.brokers || []
            } catch (error) { this.$message.error(getErrorMessage(error)) } finally { this.loading = false }
        }
    },
    mounted() { this.loadTraffic() }
}
</script>

<style scoped>
.filter-panel { margin-bottom: 22px; }
.traffic-stats { margin-top: 0; }
.result-panel { margin-bottom: 22px; padding: 22px; display: flex; align-items: center; justify-content: center; gap: 46px; background: linear-gradient(135deg, #151d2b, #202a3c); color: white; }
.result-block { display: flex; flex-direction: column; gap: 7px; text-align: center; }
.result-block span { color: #aab2c2; font-size: 12px; text-transform: uppercase; letter-spacing: .7px; }
.result-block strong { font-size: 25px; }
.result-divider { width: 1px; align-self: stretch; background: #ffffff1a; }
</style>
