import { Router } from 'express'
import axios from 'axios'
import dayjs from 'dayjs'

import leadsModel from '../models/leads.model.js'
import { getBrokers, getResidenceToken } from '../integrations/residence.service.js'

const leadsRouter = Router()

leadsRouter.get('/getAll', async (req, res) => {
    try {
        const leadsData = await leadsModel.find()
        res.status(200).json({ data: leadsData })
    } catch (e) {
        console.log(e.message)
        res.status(500).json({ err: e.message })
    }
})

leadsRouter.get('/getNullBrokerLeads', async (req, res) => {
    try {

        const { gte, lte } = req.query

        const nullBrokerLeads = await leadsModel.find({
            datedAt: {
                $gte: dayjs(gte).format('YYYY-MM-DD'),
                $lte: dayjs(lte).format('YYYY-MM-DD')
            },
            broker: null
        })

        const brokerNullPhones = []

        nullBrokerLeads.forEach((lead) => {
            brokerNullPhones.push(lead.phone)
        })

        res.status(200).json({ data: brokerNullPhones })

    } catch (e) {
        console.log(e.message)
        res.status(500).json({ err: e.message })
    }
})

leadsRouter.get('/getByDate', async (req, res) => {
    try {

        const { gte, lte, isNew, isAuto, broker } = req.query

        const filterParams = {
            datedAt: {
                $gte: dayjs(gte).format('YYYY-MM-DD'),
                $lte: dayjs(lte).format('YYYY-MM-DD'),
            }
        }

        if (isNew !== undefined) {
            filterParams.stageCode = isNew
        }

        if (isAuto !== undefined) {
            filterParams.isAuto = isAuto
        }

        if (broker !== undefined) {
            filterParams.broker = broker
        }

        console.log(filterParams, '!!!!')
        const leadsByDate = await leadsModel.find(filterParams)

        res.status(200).json({ data: leadsByDate })
    } catch (e) {
        console.log(e.message)
        res.status(500).json({ err: e.message })
    }
})

export default leadsRouter