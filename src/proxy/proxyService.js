const amqp = require('../amqp/amqp');
const proxyRepository = require('./proxyRepository');

module.exports = {
    redirect(data) {

        // amqp.produce()

        userData = {
            "url": data.url,
            "path": data.path,
            "ip": data.ip,
            "mergeIpPath": data.mergeIpPath
        }
        console.log(userData);
        return userData
    }
}