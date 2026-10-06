<template>
    <section class="panel">
        <div class="panel-header">
            <div><h2>Список рассылок</h2><p>{{ modeLabel }}</p></div>
            <el-segmented v-model="mode" :options="modeOptions" @change="loadMailings" />
        </div>
        <div v-if="mode.includes('date')" class="panel-body date-toolbar">
            <div class="field"><span class="field-label">Начало</span><el-date-picker v-model="gte" type="date" value-format="YYYY-MM-DD" format="DD.MM.YYYY" /></div>
            <div class="field"><span class="field-label">Конец</span><el-date-picker v-model="lte" type="date" value-format="YYYY-MM-DD" format="DD.MM.YYYY" /></div>
            <el-button type="primary" :icon="Search" :loading="loading" @click="loadMailings">Показать</el-button>
        </div>
        <div class="table-wrap">
            <el-table v-loading="loading" :data="mailings" empty-text="Рассылки не найдены">
                <el-table-column prop="mailingDate" label="Дата" width="120" />
                <el-table-column prop="mailingId" label="ID" width="100" />
                <el-table-column prop="mailingName" label="Название" min-width="260" show-overflow-tooltip />
                <el-table-column label="Статус" width="130"><template #default="scope"><el-tag :type="statusType(scope.row.mailingStatus)">{{ scope.row.mailingStatus || 'активна' }}</el-tag></template></el-table-column>
                <el-table-column prop="totalCalls" label="Звонки" width="100" align="right" />
                <el-table-column prop="totalLeads" label="Лиды" width="90" align="right" />
                <el-table-column label="Расход" width="120" align="right"><template #default="scope">{{ money(scope.row.totalSpent) }}</template></el-table-column>
                <el-table-column label="Авто" width="80" align="center"><template #default="scope">{{ scope.row.mailingIsAuto ? 'Да' : 'Нет' }}</template></el-table-column>
            </el-table>
        </div>
    </section>
</template>

<script>
import dayjs from 'dayjs'
import { Search } from '@element-plus/icons-vue'
import api, { getErrorMessage } from '../api.js'

export default {
    name: 'MailingsPage',
    data() {
        return {
            Search, loading: false, mailings: [], mode: 'active-date', gte: dayjs().format('YYYY-MM-DD'), lte: dayjs().format('YYYY-MM-DD'),
            modeOptions: [
                { label: 'Активные за период', value: 'active-date' }, { label: 'Все активные', value: 'active-all' },
                { label: 'Завершённые за период', value: 'finished-date' }, { label: 'Все завершённые', value: 'finished-all' }
            ]
        }
    },
    computed: { modeLabel() { return this.modeOptions.find(item => item.value === this.mode)?.label || '' } },
    methods: {
        money(value) { return new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2 }).format(Number(value) || 0) },
        statusType(status) { return status === 'finished' ? 'success' : status === 'stopped' ? 'danger' : 'primary' },
        async loadMailings() {
            this.loading = true
            const endpoints = { 'active-all': '/mailings/getAll', 'finished-all': '/mailings/getAllFinished', 'active-date': '/mailings/getByDate', 'finished-date': '/mailings/getFinishedByDate' }
            try {
                const params = this.mode.includes('date') ? { gte: this.gte, lte: this.lte } : undefined
                const response = await api.get(endpoints[this.mode], { params })
                this.mailings = response.data.data
            } catch (error) { this.$message.error(getErrorMessage(error)) } finally { this.loading = false }
        }
    },
    mounted() { this.loadMailings() }
}
</script>

<style scoped>.date-toolbar { display: flex; align-items: flex-end; gap: 12px; border-bottom: 1px solid #e7eaf0; }</style>
