import axios from "axios"
import dayjs from "dayjs"

async function getLeadsFromLidorubCRM(gte, lte) {
    try {
        const response = await axios.get('http://31.130.151.240:3000/api/leads/get?', {
            params: {
                gte: dayjs(gte).format('YYYY-MM-DD'),
                lte: dayjs(lte).format('YYYY-MM-DD')
            }
        })

        let leadData = response.data.leads

        let aggregatedBrokerMinusesObject = {}

        leadData = leadData.filter((item) => {
            return item.statusOKK === true
        })

        leadData.forEach((lead) => {
            if (aggregatedBrokerMinusesObject[lead.broker]) {
                aggregatedBrokerMinusesObject[lead.broker].minuses += 20
                aggregatedBrokerMinusesObject[lead.broker].count += 1
            } else {
                aggregatedBrokerMinusesObject[lead.broker] = {
                    broker: lead.broker,
                    minuses: 20,
                    count: 1
                }
            }
        })

        let aggregatedDataMinusesArray = Object.values(aggregatedBrokerMinusesObject)

        return aggregatedDataMinusesArray

    } catch (e) {
        console.log(`не получил ошибка в лидорусбкой ${e.message}`)
        return []
    }
}

export { getLeadsFromLidorubCRM }