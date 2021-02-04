const routes = require('express').Router();
const proxyController = require('./proxy/proxyController')


routes.get('/healthcheck', require('express-healthcheck')({
    healthy: function () {
        return { everything: 'is ok' };
    }
}));
routes.get('/*', proxyController.redirectUser)


module.exports = routes