const { Kafka } = require('kafkajs')

const kafka = new Kafka({
    clientId: 'meli-proxy-api',
    brokers: ['broker:9092']
})

const producer = kafka.producer()

const produceStats = async (data) => {
    await producer.connect()

    console.log('Producing Message')
    console.log(JSON.stringify(data));

    await producer.send({
        topic: 'proxy-statistics',
        messages: [{ value: JSON.stringify(data) }]
    })

    await producer.disconnect()
}

module.exports = produceStats
