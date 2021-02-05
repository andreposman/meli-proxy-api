require('dotenv').config()
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const routes = require('./routes');
const jsend = require('jsend');
const { logStats } = require('./kafka/logStats');
const { rateLimitByIp, rateLimitByPath, rateLimitByPathIp } = require('./middlewares/rateLimiter');


const morganOptions = `\n[:date]\nMethod: :method\nURL: :url\nStatus Code: :status\nResponse Time: :response-time ms\nUser Agent:" :user-agent\n`

class AppController {
    constructor() {
        this.express = express();
        this.middlewares();
        this.routes();
    }

    middlewares() {
        this.express.use(express.json())
        this.express.use(helmet())
        this.express.use(jsend.middleware)
        this.express.use(logStats)
        this.express.use(rateLimitByIp)
        this.express.use(rateLimitByPath)
        this.express.use(rateLimitByPathIp)
        this.express.use(morgan(morganOptions))
    }

    routes() {
        this.express.use(routes)
    }
}

module.exports = new AppController().express