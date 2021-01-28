const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const routes = require('./routes');

class AppController {

    constructor() {
        this.express = express();
        this.middlewares();
        this.routes();
    }

    middlewares() {
        this.express.use(express.json())
        this.express.use(helmet())
        // this.express.use(morgan(`\n[:date]\nMethod: :method\nURL: :url\nStatus Code: :status\nResponse Time: :response-time ms\nUser Agent:" :user-agent\n`))
    }

    routes() {
        this.express.use(routes)
    }
}

module.exports = new AppController().express