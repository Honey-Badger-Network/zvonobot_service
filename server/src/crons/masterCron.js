import axios from "axios"
import dayjs from "dayjs"
import cron from "node-cron"

import tokenModel from '../models/tokens.model.js'
import mailingsModel from "../models/mailings.model.js"
import finishedMailingsModel from "../models/finishedMailings.model.js"
import leadsModel from "../models/leads.model.js"

import { getZvonobotMailings, prepaingMailing } from '../integrations/zvonobot.service.js'
import { getBrokers, getLeads, getCallsByDate, getResidenceToken } from "../integrations/residence.service.js"
import { getUIScalls } from "../integrations/uis.service.js"
import { getEnvyBoxCalls } from "../integrations/envybox.service.js"

async function masterUpdateData(gte, lte) {
    try {

        console.log('masterCronData has been started !!!')

        // получение токенов
        const zvonobotToken = await tokenModel.getToken('zvonobot')
        const residenceToken = await getResidenceToken()
        const zvonobotAPIKey = await tokenModel.getToken('zvonobotApiKey')
        
        // const residenceToken = await tokenModel.getToken('residence')
        // const uisToken = await tokenModel.getToken('uis')

        const zvonobotMailingsLeads = []

        const zvonobotMailings = await getZvonobotMailings(zvonobotToken, gte, lte) || []
        // const zvonobotMailings = await getZvonobotMailings(zvonobotAPIKey, gte, lte) || []

        console.log('Список активных ддля обработки расылок ....', zvonobotMailings)


        // получение даных с интеграций сервисом

        const brokers = await getBrokers(residenceToken)
        // const uisCalls = await getUIScalls(uisToken, gte, lte, brokers)
        const residenceLeads = await getLeads(residenceToken, gte, lte)
        const envyboxCalls = await getEnvyBoxCalls(gte, lte)
        const residenceCalls = await getCallsByDate(residenceToken, gte, lte)

        // главный цикл обработки расылок
        for (let mailing of zvonobotMailings) {
            const fullMailingInfo = await prepaingMailing(mailing, zvonobotToken) || []
            zvonobotMailingsLeads.push(...fullMailingInfo.leadsInMailing)
            const miniResult = await mailingsModel.updateData(fullMailingInfo)

            if (fullMailingInfo.mailingStatus === 'finished' || fullMailingInfo.mailingStatus === 'stopped') {
                const result = await finishedMailingsModel.update(fullMailingInfo)
            }

            // главный цикл по обработки лидов внутр ирасылоки
            fullMailingInfo.leadsInMailing.forEach((lead) => {
                // let leadCallKey = uisCalls.find((call) => {
                //     return call.contactPhone === lead.phone
                // })

                if (Array.isArray(envyboxCalls)) {
                    let envyCallKey = envyboxCalls.find((call) => {
                        return call.phone === lead.phone.replace(/\D/g, '')
                    })

                    if (envyCallKey) {
                        lead.stageCode = envyCallKey.stageCode
                        lead.stagePrice = envyCallKey.callPrice
                        lead.stage = envyCallKey.stage
                        lead.envyCallId = envyCallKey.envyCallId
                        lead.isFoundInEnvy = true
                    } else {
                        lead.stageCode = 'new'
                        lead.stagePrice = 10
                        lead.stage = 'Новый (нет в envy)'
                        lead.envyCallId = null
                        lead.isFoundInEnvy = false
                    }
                } else {
                    lead.stageCode = null
                    lead.stagePrice = 0
                    lead.stage = null
                    lead.envyCallId = null
                    lead.isFoundInEnvy = false
                }

                if ( Array.isArray(residenceCalls)) {

                    let residenceCallKey = residenceCalls.find((call) => {
                        return call.contactPhone === lead.phone
                    })
        
                    let residenceKey = residenceLeads.filter((item) => {
                        return item.phone === lead.phone
                    })

                    if (residenceCallKey) {
                        lead.broker = residenceCallKey.user
                    }
        
                    if (residenceKey && residenceKey.length > 0) {
                        lead.isResidence = true
                        
                        residenceKey.forEach((item) => {
                            lead.statuses.push(item.status)
                            lead.offerPrice += ['hold', 'confirmed', 'refused'].includes(item.status) ? item?.price?.offer : 0
    
                            // если с зарплатананя => звонки не сомг найти и сопоставить бркоера (но был перевод в residence) тогда из лидов возьмем
                            if (lead.isResidence === true && lead.broker === null) {
                                console.log(`нашелся лид без определеного но с переводом ${lead.phone} сопоставим ему ${item?.userId?.name}`)
                                lead.broker = item?.userId?.name || null
                            }
    
                        })
    
                    }

                } else {
                    lead.broker = null
                    lead.isResidence = false
                    lead.statuses = []
                    lead.offerPrice = 0
                }

            })

            // цикл по переобновлению лидов в БД
            for (let lead of fullMailingInfo.leadsInMailing) {
                const result = await leadsModel.updateLead(lead)
            }

        }
        console.log('лиды обновлены/созданы новые')
    } catch (e) {
        console.log(`ошибка в мастер кроне ${e.message}`)
    }
}

function updateDataCron(schedule) {

    masterUpdateData(new Date, new Date)

    cron.schedule(schedule, () => {
        try {
            masterUpdateData(new Date, new Date)
            console.log(`функция обновления успешно вполнена ${schedule}`)
        } catch (e) {
            console.error(`Ошибка при обновление даных ${e.message}`)
        }
    })
}


export { masterUpdateData, updateDataCron }