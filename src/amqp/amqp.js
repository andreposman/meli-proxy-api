const amqp = require('amqplib');
require("dotenv").config();

const AMQP_URI = `amqp://localhost:${process.env.AMQP_PORT}`

module.exports = {
    produce() {

        amqp.connect(AMQP_URI, (err, conn) => {
            conn.createChannel((err, channel) => {
                const q = 'MELI PROXY DATA'
                const msg = 'This my user data'

                channel.assertQueue(q, { durable: false })
                channel.sendToQueue(q, new Buffer(msg))
                console.log(`[x] Sent ${msg}`)
            })
            setTimeout(() => {
                conn.close(); process.exit(0)
            }, 500);

        })
    }
}
