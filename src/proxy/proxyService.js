const amqp = require('../amqp/amqp');
const proxyRepository = require('./proxyRepository');

module.exports = {
    redirect(data) {

        // amqp.produce()

        userData = {
            "path": data.path,
            "ip": data.ip,
            "mergeIpPath": data.mergeIpPath
        }
        console.log(userData);

        // proxyRepository.createRules(userData)
        // proxyRepository.getRules()

        return userData
    }
}