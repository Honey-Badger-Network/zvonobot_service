<template>
    <div class="page-grid">
        <section class="panel full-span">
            <div class="panel-header">
                <div><h2>Ключи интеграций</h2><p>Значения скрыты по умолчанию</p></div>
                <el-button :icon="Refresh" @click="loadTokens">Обновить список</el-button>
            </div>
            <div class="table-wrap">
                <el-table v-loading="loading" :data="tokens" empty-text="Токены не найдены">
                    <el-table-column prop="service" label="Сервис" min-width="180" />
                    <el-table-column label="Токен" min-width="360">
                        <template #default="scope"><code>{{ visible[scope.row._id] ? scope.row.token : mask(scope.row.token) }}</code></template>
                    </el-table-column>
                    <el-table-column width="90" align="right">
                        <template #default="scope"><el-button link :icon="visible[scope.row._id] ? Hide : View" @click="toggle(scope.row._id)" /></template>
                    </el-table-column>
                </el-table>
            </div>
        </section>

        <section class="panel">
            <div class="panel-header"><div><h2>Обновить токен</h2><p>Заменяет значение выбранного сервиса</p></div></div>
            <div class="panel-body">
                <el-form label-position="top">
                    <el-form-item label="Сервис"><el-select v-model="form.service" placeholder="Выберите сервис" style="width:100%"><el-option v-for="item in tokens" :key="item._id" :label="item.service" :value="item.service" /></el-select></el-form-item>
                    <el-form-item label="Новое значение"><el-input v-model="form.token" type="password" show-password placeholder="Вставьте токен" /></el-form-item>
                    <el-button type="primary" :loading="saving" @click="updateToken">Сохранить токен</el-button>
                </el-form>
            </div>
        </section>

        <section class="panel">
            <div class="panel-header"><div><h2>Проверить токен</h2><p>Проверяет сохранённый токен запросом к API сервиса</p></div></div>
            <div class="panel-body">
                <el-form label-position="top">
                    <el-form-item label="Сервис">
                        <el-select v-model="checkService" placeholder="Выберите сервис" style="width:100%">
                            <el-option label="Звонобот" value="zvonobot" />
                        </el-select>
                    </el-form-item>
                    <el-button type="primary" :icon="CircleCheck" :loading="checkingToken" @click="checkToken">Проверить токен</el-button>
                </el-form>
            </div>
        </section>

        <section class="panel">
            <div class="panel-header"><div><h2>Ручное обновление</h2><p>Запустить мастер-крон за выбранную дату</p></div></div>
            <div class="panel-body">
                <el-form label-position="top">
                    <el-form-item label="Дата"><el-date-picker v-model="cronDate" type="date" value-format="YYYY-MM-DD" format="DD.MM.YYYY" style="width:100%" /></el-form-item>
                    <el-button type="primary" :icon="VideoPlay" :loading="cronLoading" @click="runCron">Запустить обновление</el-button>
                </el-form>
            </div>
        </section>
    </div>
</template>

<script>
import dayjs from 'dayjs'
import { Refresh, View, Hide, VideoPlay, CircleCheck } from '@element-plus/icons-vue'
import api, { getErrorMessage } from '../api.js'

export default {
    name: 'TokensPage',
    data() {
        return { Refresh, View, Hide, VideoPlay, CircleCheck, tokens: [], visible: {}, loading: false, saving: false, checkingToken: false, checkService: 'zvonobot', cronLoading: false, cronDate: dayjs().format('YYYY-MM-DD'), form: { service: '', token: '' } }
    },
    methods: {
        mask(value = '') { return value.length < 12 ? '••••••••' : `${value.slice(0, 6)}••••••••••${value.slice(-5)}` },
        toggle(id) { this.visible[id] = !this.visible[id] },
        async loadTokens() {
            this.loading = true
            try {
                const response = await api.get('/tokens')
                this.tokens = response.data.data
                if (!this.form.service && this.tokens.length) this.form.service = this.tokens[0].service
            } catch (error) { this.$message.error(getErrorMessage(error)) } finally { this.loading = false }
        },
        async updateToken() {
            if (!this.form.service || !this.form.token) return this.$message.warning('Выберите сервис и введите токен')
            this.saving = true
            try {
                await api.post('/tokens/update', { editService: this.form.service, editToken: this.form.token })
                this.form.token = ''
                await this.loadTokens()
                this.$message.success('Токен обновлён')
            } catch (error) { this.$message.error(getErrorMessage(error)) } finally { this.saving = false }
        },
        async checkToken() {
            if (!this.checkService) return this.$message.warning('Выберите сервис')
            this.checkingToken = true
            try {
                await api.get(`/tokens/check/${this.checkService}`)
                this.$message.success('Токен Звонобота работает')
            } catch (error) { this.$message.error(getErrorMessage(error)) } finally { this.checkingToken = false }
        },
        async runCron() {
            this.cronLoading = true
            try { await api.get('/crons/update', { params: { date: this.cronDate } }); this.$message.success('Обновление завершено') }
            catch (error) { this.$message.error(getErrorMessage(error)) } finally { this.cronLoading = false }
        }
    },
    mounted() { this.loadTokens() }
}
</script>

<style scoped>code { padding: 5px 8px; border-radius: 6px; background: #f6f7fa; color: #4d5668; font-size: 12px; word-break: break-all; }</style>
