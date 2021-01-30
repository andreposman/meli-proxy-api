const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const routes = require('./routes');
const jsend = require('jsend');
const {customRedisRateLimiterByIP, customRedisRateLimiterByPath} = require('../src/proxy/rateLimiter')

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
        this.express.use(customRedisRateLimiterByIP)
        // this.express.use(customRedisRateLimiterByPath)

        // this.express.use(morgan(`\n[:date]\nMethod: :method\nURL: :url\nStatus Code: :status\nResponse Time: :response-time ms\nUser Agent:" :user-agent\n`))
    }

    routes() {
        this.express.use(routes)
    }
}

module.exports = new AppController().express