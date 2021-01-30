const routes = require('express').Router();
const proxyController = require('./proxy/proxyController')

routes.get('/', proxyController.redirectUser)

module.exports = routes