import axios from "axios"
import dayjs from "dayjs"

async function getEnvyToken() {
    try {
        const response = await axios.post('https://nedvizhimost.envycrm.com/api/v2/auth/login', {
            email: 'simakowladimir@mail.ru',
            password: 'cafGhE'
        })
        return response.data.token
    } catch (e) {
        console.log(`ошибка получения токена для envyBox ${e.message}`)
    }
}

async function getEnvyBoxCalls(gte, lte) {
    try {

        let dateType = 'period'

        // if (dayjs(gte).format('YYYY-MM-DD') === dayjs(lte).format('YYYY-MM-DD')) {
        //     if (dayjs(gte).format('YYYY-MM-DD') === dayjs(new Date).format('YYYY-MM-DD')) {
        //         dateType = 'today'
        //     } else if (dayjs(gte).format('YYYY-MM-DD') === dayjs(new Date).subtract(1, 'day').format('YYYY-MM-DD')) {
        //         dateType = 'yesterday'
        //     } else {
        //         dateType = 'month'
        //     }
        // }

        console.log(dateType, '$&&$^%&*&^((&^(&')

        const params = {
            type: 'leads',
            keyword: '',
            offset: 0,
            custom_inputs: false,
            filter: JSON.stringify({
                customDateType: {},
                dateFilters: [
                    {
                        dateType: dateType,
                        dateSelectType: 'created',
                        showDates: false,
                        dates: {
                            start: dayjs(gte).format('YYYY-MM-DD'),
                            end: dayjs(lte).format('YYYY-MM-DD')
                        }
                    }
                ],
                employees: { users: [], departments: [] },
                members: { users: [], departments: [] },
                leadStages: [],
                dealStages: [],
                dateStages: [],
                pipelines: [],
                inboxTypes: [
                    485727, 485730, 485736, 485739, 485742, 1238128, 485745, 485748,
                    1239454, 485751, 485754, 486030, 486225, 1396015, 1254862, 486228,
                    1263709, 1253089, 1318642, 1385764, 509565, 508062, 1324717, 1487063,
                    1487061, 1475940, 701858, 1382620, 1409483, 1382623, 1317583
                ],
                tags: [],
                inputs: {
                    1: { service: {}, custom: {} },
                    2: { service: {}, custom: {} },
                    3: { service: {}, custom: {} },
                    4: { service: {}, custom: {} },
                    5: { service: {}, custom: {} }
                },
                logEvents: [],
                clientsWithoutDeals: 0,
                birthday: {
                    start: dayjs(gte).format('YYYY-MM-DD'),
                    end: dayjs(lte).format('YYYY-MM-DD'),
                    dateType: 'all'
                },
                firstDealClient: 0,
                businessProcess: {
                    actions: [],
                    statuses: [],
                    pipelines: []
                }
            }),
            limit: 0,
            _ts: 1778747613245
        }

        const token = await getEnvyToken()

        const response = await axios.get('https://nedvizhimost.envycrm.com/api/v2/search', {
            params: params,
            headers: { 
                "authorization": token
            },
        })

        let minimysedData = []

        response.data.result.forEach((call) => {
            let phone = call.phone.replace(/\D/g, '')
            let stage = call.stage
            let envyCallId = call.id
            let inbox_type_id = call.inbox_type_id

            let stageCode
            let callPrice

            if (stage === 'Существующий клиент') {
                stageCode = 'base'
                callPrice = 5
            } else {
                stageCode = 'new'
                callPrice = 10
            }

            console.log(call, '&&*&&***&&&^&%*(&')

            minimysedData.push({
                phone,
                stage,
                stageCode,
                inbox_type_id,
                callPrice,
                envyCallId
            })
        })

        minimysedData = minimysedData.filter((call) => {
            return call.inbox_type_id !== 485733 // если инбокс тай айди не равен типу для "звонок"
        })

        console.log(minimysedData.length, 'minimysedData 111111')

        // TODO либо использовать обхект params другй котоырй использует все типы кромен "звонок"

        return minimysedData

    } catch (e) {
        console.log(`ошибка получения звонков из EnvyBox ${e.message}`)
    }
}

export { getEnvyToken, getEnvyBoxCalls }