import { Router } from "express"
import dayjs from "dayjs"
import axios from "axios"

import leadsModel from "../models/leads.model.js"
import { getLeadsFromLidorubCRM } from "../integrations/leadorub.service.js"
import { getBrokersListWithRole } from "../integrations/residence.service.js"

const minusesRoute = Router()


minusesRoute.get('/byDate', async (req, res) => {
    try {
        
        const { gte, lte } = req.query

        const leadsByDate = await leadsModel.find({
            datedAt: {
                $gte: dayjs(gte).format('YYYY-MM-DD'),
                $lte: dayjs(lte).format('YYYY-MM-DD'),
            }
        })

        const lidorubLeads = await getLeadsFromLidorubCRM(gte, lte)

        // console.log(lidorubLeads, '!@#!@#!@#!@#!@')

        let aggregatedData = {}

        // console.log(leadsByDate, '!!!!!!')
        const brokersList = await getBrokersListWithRole()

        leadsByDate.forEach((lead) => {

            const isIncludesHold = lead.statuses.includes('hold') || lead.statuses.includes('confirmed') || lead.statuses.includes('refused')

            let priceToInput

            let leadBrokerObject = brokersList.find((item) => {
                return item.user === lead.broker
            })

            if (leadBrokerObject) {
                lead.userRole = leadBrokerObject.userRole
            }


            // если этот лид авто и его бркоер на окладчик
            if (lead.isAuto === true && lead.userRole === 'Окладчик 2.0') {
                priceToInput = 5
            } else {
                priceToInput = lead.stagePrice
            }

            // priceToInput = lead.stagePrice

            if (aggregatedData[lead.broker]) {
                aggregatedData[lead.broker].countInputs += 1
                aggregatedData[lead.broker].countLeads += lead.isResidence ? 1 : 0
                aggregatedData[lead.broker].offerPrice += lead.offerPrice
                aggregatedData[lead.broker].countHold += isIncludesHold ? 1 : 0,
                aggregatedData[lead.broker].totalMinuses += priceToInput
                aggregatedData[lead.broker].countNew += lead.stageCode === 'new' && lead.isAuto === false ? 1 : 0
                aggregatedData[lead.broker].countBase += lead.stageCode === 'base' && lead.isAuto === false ? 1 : 0
                aggregatedData[lead.broker].countAuto += lead.isAuto === true ? 1 : 0

            } else {
                aggregatedData[lead.broker] = {
                    broker: lead.broker,
                    countInputs: 1,
                    countLeads: lead.isResidence ? 1 : 0,
                    offerPrice: lead.offerPrice,
                    countHold: isIncludesHold ? 1 : 0,
                    totalMinuses: priceToInput,
                    countNew: lead.stageCode === 'new' && lead.isAuto === false ? 1 : 0,
                    countBase: lead.stageCode === 'base' && lead.isAuto === false ? 1 : 0,
                    countAuto: lead.isAuto === true ? 1 : 0
                }
            }
        })

        
        aggregatedData = Object.values(aggregatedData)

        aggregatedData.forEach((broker) => {

            let brokerLidroubDataKeyObject = lidorubLeads.find((item) => {
                return item.broker === broker.broker
            })

            if (brokerLidroubDataKeyObject) {
                broker.totalMinuses += brokerLidroubDataKeyObject.minuses
                // TODO потом вренуть прибавление минусов когад скажут !!!
                broker.countLidorubs = brokerLidroubDataKeyObject.count
            }

        })

        console.log(aggregatedData, '*****&&&**&&')

        res.status(200).json({ data: aggregatedData })

    } catch (e) {
        console.log(e.message)
        res.status(500).json({ err: e.message })
    }
})

export default minusesRoute