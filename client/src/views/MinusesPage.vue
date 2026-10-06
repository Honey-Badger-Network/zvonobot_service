<template>
    <section class="panel">
        <div class="panel-header"><div><h2>Минусы по брокерам</h2><p>Входы, переводы, холды и расходы</p></div></div>
        <div class="panel-body period-bar">
            <div class="field"><span class="field-label">Начало</span><el-date-picker v-model="gte" type="date" value-format="YYYY-MM-DD" format="DD.MM.YYYY" /></div>
            <div class="field"><span class="field-label">Конец</span><el-date-picker v-model="lte" type="date" value-format="YYYY-MM-DD" format="DD.MM.YYYY" /></div>
            <el-button type="primary" :icon="Search" :loading="loading" @click="loadMinuses">Показать</el-button>
        </div>
        <div class="table-wrap">
            <el-table v-loading="loading" :data="rows" :row-class-name="rowClass" show-summary :summary-method="summaryMethod" empty-text="Нет данных за выбранный период">
                <el-table-column prop="broker" label="Брокер" min-width="190" fixed><template #default="scope">{{ scope.row.broker }} <el-tag v-if="scope.row.onBaseSalary" size="small" type="info">оклад</el-tag></template></el-table-column>
                <el-table-column prop="countInputs" label="Входы" width="100" align="right" />
                <el-table-column prop="countLeads" label="Переводы" width="110" align="right" />
                <el-table-column prop="countHold" label="Холды" width="95" align="right" />
                <el-table-column prop="offerPrice" label="Оффер" width="120" align="right"><template #default="scope">{{ money(scope.row.offerPrice) }}</template></el-table-column>
                <el-table-column prop="totalMinuses" label="Минусы" width="120" align="right"><template #default="scope"><span class="money-negative">{{ money(scope.row.totalMinuses) }}</span></template></el-table-column>
                <el-table-column prop="countNew" label="New" width="85" align="right" />
                <el-table-column prop="countBase" label="Base" width="85" align="right" />
                <el-table-column prop="countAuto" label="Auto" width="85" align="right" />
                <el-table-column prop="countLidorubs" label="Lidorub" width="100" align="right" />
            </el-table>
        </div>
    </section>
</template>

<script>
import dayjs from 'dayjs'
import { Search } from '@element-plus/icons-vue'
import api, { getErrorMessage } from '../api.js'

export default {
    name: 'MinusesPage',
    data() { return { Search, gte: dayjs().format('YYYY-MM-DD'), lte: dayjs().format('YYYY-MM-DD'), rows: [], loading: false } },
    methods: {
        money(value) { return `${new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 0 }).format(Number(value) || 0)} ₽` },
        rowClass({ row }) { return row.broker === 'Не определено' ? 'danger-row' : '' },
        summaryMethod({ columns, data }) {
            const labels = { countInputs: 0, countLeads: 0, countHold: 0, offerPrice: 0, totalMinuses: 0, countNew: 0, countBase: 0, countAuto: 0, countLidorubs: 0 }
            data.forEach(row => Object.keys(labels).forEach(key => { labels[key] += Number(row[key]) || 0 }))
            return columns.map((column, index) => {
                if (index === 0) return 'Итого'
                const value = labels[column.property]
                if (value === undefined) return ''
                return ['offerPrice', 'totalMinuses'].includes(column.property) ? this.money(value) : value
            })
        },
        async loadMinuses() {
            this.loading = true
            try {
                const response = await api.get('/minuses/byDate', { params: { gte: this.gte, lte: this.lte } })
                this.rows = (response.data.data || []).filter(row => row.broker !== 'total values')
            } catch (error) { this.$message.error(getErrorMessage(error)) } finally { this.loading = false }
        }
    },
    mounted() { this.loadMinuses() }
}
</script>

<style scoped>.period-bar { display: flex; align-items: flex-end; gap: 12px; border-bottom: 1px solid #e7eaf0; }</style>
