<template>
    <section class="panel">
        <div class="panel-header">
            <div><h2>Фильтры</h2><p>Выберите период и параметры лидов</p></div>
            <div class="toolbar compact">
                <el-input v-model="phone" clearable placeholder="Телефон" style="width:210px" @keyup.enter="findByPhone"><template #prefix><el-icon><Search /></el-icon></template></el-input>
                <el-button @click="findByPhone">Найти</el-button>
            </div>
        </div>
        <div class="panel-body">
            <div class="toolbar">
                <div class="field"><span class="field-label">Начало</span><el-date-picker v-model="filters.gte" type="date" value-format="YYYY-MM-DD" format="DD.MM.YYYY" style="width:100%" /></div>
                <div class="field"><span class="field-label">Конец</span><el-date-picker v-model="filters.lte" type="date" value-format="YYYY-MM-DD" format="DD.MM.YYYY" style="width:100%" /></div>
                <div class="field"><span class="field-label">Источник</span><el-select v-model="filters.isAuto" clearable placeholder="Все"><el-option label="Авто" :value="true" /><el-option label="Не авто" :value="false" /></el-select></div>
                <div class="field"><span class="field-label">Этап</span><el-select v-model="filters.isNew" clearable placeholder="Все"><el-option label="Новые" value="new" /><el-option label="База" value="base" /></el-select></div>
                <div class="field"><span class="field-label">Брокер</span><el-select v-model="filters.broker" clearable filterable placeholder="Все"><el-option v-for="broker in brokers" :key="broker.user" :label="broker.user" :value="broker.user" /></el-select></div>
                <el-button type="primary" :icon="Search" :loading="loading" @click="loadLeads">Показать</el-button>
                <el-button :icon="Download" @click="downloadUnassigned">Без брокера</el-button>
            </div>
        </div>
        <div class="table-wrap">
            <el-table v-loading="loading" :data="leads" height="620" empty-text="Укажите фильтры и выполните поиск">
                <el-table-column prop="datedAt" label="Дата" width="110" fixed />
                <el-table-column label="Время" width="95"><template #default="scope">{{ formatTime(scope.row.startedAt) }}</template></el-table-column>
                <el-table-column prop="phone" label="Телефон" width="150" />
                <el-table-column label="Брокер" min-width="150"><template #default="scope">{{ scope.row.broker || 'Не определён' }}</template></el-table-column>
                <el-table-column prop="mailingName" label="Рассылка" min-width="210" show-overflow-tooltip />
                <el-table-column prop="mailingId" label="ID" width="90" />
                <el-table-column label="Трансфер" width="105" align="center"><template #default="scope"><el-tag :type="scope.row.isResidence ? 'success' : 'info'" effect="light">{{ scope.row.isResidence ? 'Да' : 'Нет' }}</el-tag></template></el-table-column>
                <el-table-column prop="stage" label="Этап" min-width="150" show-overflow-tooltip />
                <el-table-column prop="stagePrice" label="Цена" width="90" align="right" />
                <el-table-column label="Авто" width="85" align="center"><template #default="scope">{{ scope.row.isAuto ? 'Да' : 'Нет' }}</template></el-table-column>
                <el-table-column prop="offerPrice" label="Оффер" width="105" align="right" />
                <el-table-column label="Статусы" min-width="180"><template #default="scope"><el-tag v-for="status in scope.row.statuses || []" :key="status" size="small" class="status-tag">{{ status }}</el-tag></template></el-table-column>
            </el-table>
        </div>
    </section>

    <el-dialog v-model="phoneDialog" title="Результаты поиска по телефону" width="760px">
        <el-table :data="phoneResults" empty-text="Совпадений нет">
            <el-table-column prop="datedAt" label="Дата" width="110" />
            <el-table-column prop="broker" label="Брокер" min-width="150" />
            <el-table-column prop="mailingName" label="Рассылка" min-width="200" />
            <el-table-column prop="stage" label="Этап" min-width="130" />
            <el-table-column label="Авто" width="75"><template #default="scope">{{ scope.row.isAuto ? 'Да' : 'Нет' }}</template></el-table-column>
        </el-table>
    </el-dialog>
</template>

<script>
import dayjs from 'dayjs'
import { Search, Download } from '@element-plus/icons-vue'
import api, { getErrorMessage } from '../api.js'

export default {
    name: 'LeadsPage',
    data() {
        return {
            Search, Download, loading: false, leads: [], brokers: [], phone: '', phoneDialog: false, phoneResults: [],
            filters: { gte: dayjs().format('YYYY-MM-DD'), lte: dayjs().format('YYYY-MM-DD'), broker: null, isAuto: null, isNew: null }
        }
    },
    methods: {
        formatTime(date) { return date ? dayjs(date).format('HH:mm:ss') : '—' },
        queryParams() {
            const params = { gte: this.filters.gte, lte: this.filters.lte }
            if (this.filters.broker !== null && this.filters.broker !== '') params.broker = this.filters.broker
            if (this.filters.isAuto !== null && this.filters.isAuto !== '') params.isAuto = this.filters.isAuto
            if (this.filters.isNew !== null && this.filters.isNew !== '') params.isNew = this.filters.isNew
            return params
        },
        async loadLeads() {
            this.loading = true
            try { const response = await api.get('/leads/getByDate', { params: this.queryParams() }); this.leads = response.data.data }
            catch (error) { this.$message.error(getErrorMessage(error)) } finally { this.loading = false }
        },
        async loadBrokers() {
            try { const response = await api.get('/brokers/getAll'); this.brokers = response.data.data || [] }
            catch (error) { this.$message.warning(`Не удалось загрузить брокеров: ${getErrorMessage(error)}`) }
        },
        async findByPhone() {
            if (!this.phone.trim()) return this.$message.warning('Введите телефон')
            try { const response = await api.get('/leads/getByPhone', { params: { phone: this.phone.trim() } }); this.phoneResults = response.data.data; this.phoneDialog = true }
            catch (error) { this.$message.error(getErrorMessage(error)) }
        },
        async downloadUnassigned() {
            try {
                const response = await api.get('/leads/getNullBrokerLeads', { params: { gte: this.filters.gte, lte: this.filters.lte } })
                const blob = new Blob([(response.data.data || []).join('\n')], { type: 'text/plain;charset=utf-8' })
                const url = URL.createObjectURL(blob)
                const link = document.createElement('a')
                link.href = url; link.download = `leads-without-broker-${this.filters.gte}-${this.filters.lte}.txt`; link.click()
                URL.revokeObjectURL(url)
            } catch (error) { this.$message.error(getErrorMessage(error)) }
        }
    },
    mounted() { this.loadBrokers(); this.loadLeads() }
}
</script>

<style scoped>
.compact { align-items: center; }
.status-tag { margin: 2px 4px 2px 0; }
</style>
