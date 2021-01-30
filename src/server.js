const app = require('./app');
const amqp = require('amqplib');
require("dotenv").config();

app.listen(process.env.PORT || 3001, (err) => {
    console.log(`\nServer running on http://localhost:${process.env.PORT}\n`);
})