import { Router } from 'express'
import axios from 'axios'
import dayjs from 'dayjs'

import tokensModel from '../models/tokens.model.js'

const tokensRouter = Router()

tokensRouter.get('/', async (req, res) => {
    try {
        const tokens = await tokensModel.find()
        res.status(200).json({ data: tokens })
    } catch (e) {
        console.log(e.message)
        res.status(500).json({ err: e.message })
    }
})

tokensRouter.get('/check/:service', async (req, res) => {
    const { service } = req.params

    if (service !== 'zvonobot') {
        return res.status(400).json({ err: 'Проверка для выбранного сервиса не поддерживается' })
    }

    try {
        const token = await tokensModel.getToken(service)

        if (!token) {
            return res.status(404).json({ err: 'Токен Звонобота не найден' })
        }

        await axios.get('https://lk.zvonobot.ru/api/additionalServices/get', {
            headers: { authorization: `Bearer ${token}` },
            timeout: 15_000,
        })

        return res.status(200).json({ valid: true, service })
    } catch (error) {
        const status = error.response?.status

        if (status === 401 || status === 403) {
            return res.status(401).json({ valid: false, service, err: 'Токен Звонобота недействителен или истёк' })
        }

        console.error(`Ошибка проверки токена ${service}:`, error.message)
        return res.status(502).json({ valid: false, service, err: 'Не удалось проверить токен через API Звонобота' })
    }
})

tokensRouter.post('/update', async (req, res) => {
    try {
        const { editService, editToken } = req.body
        const result = await tokensModel.updateToken(editService, editToken)
        res.status(200).json({ result })
    } catch (e) {
        console.log(e.message)
        res.status(500).json({ err: e.message })
    }
})

export default tokensRouter
