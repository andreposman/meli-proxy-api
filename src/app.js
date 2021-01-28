const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');

class AppController {

    constructor() {
        this.express = express();
        this.middlewares();
    }

    middlewares() {
        this.express.use(express.json())
        this.express.use(helmet())
        this.express.use(morgan(`\n[:date]\nMethod: :method\nURL: :url\nStatus Code: :status\nResponse Time: :response-time ms\nUser Agent:" :user-agent\n`))
    }
}

module.exports = new AppController().express