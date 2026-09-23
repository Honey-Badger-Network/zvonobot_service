import { Router } from 'express'
import axios from 'axios'
import dayjs from 'dayjs'

import { masterUpdateData } from '../crons/masterCron.js'

const cronRouter = Router()

cronRouter.get('/update', async (req, res) => {
    try {
        const { date } = req.query
        const result = await masterUpdateData(date, date)
        res.status(200).json({ msg: result })
    } catch (e) {
        console.log(e.message)
        res.status(500).json({ msg: e.message })
    }
})

export default cronRouter