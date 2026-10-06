import axios from 'axios'

const api = axios.create({
    baseURL: '/api',
    timeout: 60_000
})

export function getErrorMessage(error) {
    return error.response?.data?.err || error.response?.data?.msg || error.message || 'Неизвестная ошибка'
}

export default api
