import { Router } from 'express'
import axios from 'axios'
import dayjs from 'dayjs'

import leadsModel from '../models/leads.model.js'
import { getBrokers, getResidenceToken } from '../integrations/residence.service.js'


const brokersRoute = Router()

brokersRoute.get('/getAll', async (req, res) => {
    try {
        const residenceToken = await getResidenceToken()
        const data = await getBrokers(residenceToken)
        res.status(200).json({ data: data })
    } catch (e) {
        console.log(e.message)
        res.status(500).json({ err: e.message })
    }
})


export default brokersRoute