import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const API_PROXY_TARGET = 'http://localhost:9000'
// const API_PROXY_TARGET = 'http://31.130.151.240:9000'

export default defineConfig({
    plugins: [vue()],
    server: {
        host: '0.0.0.0',
        port: 8000,
        strictPort: true,
        proxy: {
            '/api': {
                target: API_PROXY_TARGET,
                changeOrigin: true
            }
        }
    }
})
