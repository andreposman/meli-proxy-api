const { logStats } = require('../kafka/logStats');
const moment = require('moment');

const message = {
    'ip': '192.168.0.1',
    'path': '/products',
    'mergePathIp': '192.168.0.1' + '/products',
    'timestamp': moment().unix()
}

describe('Kafka Producing and loging stats', () => {
    test('It should publish a message to a Kafka topic', () => {
        expect(logStats(message).then(response => {
            expect(response).toBe(true)
        }))
    })
})