const routes = require('express').Router();
const proxyController = require('./proxy/proxyController')


// routes.get('/', proxyController.redirectUser)
routes.get('/products', proxyController.redirectUser)
routes.get('/productss', proxyController.redirectUser)


module.exports = routes