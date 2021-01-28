const service = require('./proxyService');

module.exports = {
    redirectUser(req, res, next) {
        const path = req.headers.host
        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
        const mergeIpPath = ip + path

        const data = { path, ip, mergeIpPath }

        const userData = service.redirect(data)



        return res.send(userData)
    }
}
