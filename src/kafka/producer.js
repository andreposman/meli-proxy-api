const { Kafka } = require('kafkajs')

const kafka = new Kafka({
    clientId: 'meli-proxy-api',
    brokers: ['kafka:29091']
})

const admin = kafka.admin()

const producer = kafka.producer()
// remember to connect and disconnect when you are done

// const run = async () => {
//     await admin.connect()
//     await admin.createTopics({
//         waitForLeaders: true,
//         validateOnly: true,
//         topics: [
//             { topic: 'proxy-statistics' },
//         ],
//     })
//     await admin.disconnect()

// }

const produceStats = async (data) => {
    await producer.connect()
    await producer.send({
        topic: 'proxy-statistics',
        messages: [{ key: 'stats', value: JSON.stringify(data) }]
    })

    await producer.disconnect()
}

// run()

module.exports = produceStats