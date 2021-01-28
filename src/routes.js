const routes = require('express').Router();
const proxyController = require('./proxy/proxyController')
const rateLimit = require('express-rate-limit');


const limiter = rateLimit({
    windowMs: 30 * 1000, //timeout 
    max: 10, // requests by ip
    message: "This IP has made too many requests for this path",
})


routes.get('/', proxyController.redirectUser)

module.exports = routes