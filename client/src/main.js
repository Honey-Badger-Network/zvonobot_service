import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import ru from 'element-plus/es/locale/lang/ru'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'element-plus/dist/index.css'

import App from './App.vue'
import router from './router.js'
import './styles.css'

const app = createApp(App)

Object.entries(ElementPlusIconsVue).forEach(([name, component]) => {
    app.component(name, component)
})

app.use(router)
app.use(ElementPlus, { locale: ru })
app.mount('#app')
