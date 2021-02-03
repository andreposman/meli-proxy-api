const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const routes = require('./routes');
const jsend = require('jsend');
const cors = require('cors');
const { logStats } = require('./kafka/logger');
const { rateLimitByIp, rateLimitByPath, rateLimitByPathIp } = require('./middlewares/rateLimiter')
// const {pathValidator} = require('./helpers/validator');
require('dotenv').config()

const NODE_ENV = process.env.NODE_ENV
const morganOptions = `\n[:date]\nMethod: :method\nURL: :url\nStatus Code: :status\nResponse Time: :response-time ms\nUser Agent:" :user-agent\n`

const allowedOrigins = ["http://localhost:3000", "http://localhost:3010"];
class AppController {

    constructor() {
        this.express = express();
        this.middlewares();
        this.routes();
    }

    middlewares() {
        if (NODE_ENV === 'test') {
            this.express.use(express.json())
            this.express.use(helmet())
            this.express.use(jsend.middleware)
        } else {
            this.express.use(cors())
            this.express.use(express.json())
            this.express.use(helmet())
            this.express.use(jsend.middleware)
            // this.express.use(pathValidator)
            this.express.use(logStats)

            this.express.use(rateLimitByIp)
            this.express.use(rateLimitByPath)
            this.express.use(rateLimitByPathIp)

            this.express.use(morgan(morganOptions))
        }

    }

    routes() {
        this.express.use(routes)
    }
}

module.exports = new AppController().express