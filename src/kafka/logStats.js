const moment = require('moment')
const produceStats = require('./producer');


const logStats = async (req, res, next) => {
    try {
        const timeStamp = moment().unix()
        const mergedPathIp = req.ip + req.path

        const data = {
            ip: req.ip,
            path: req.path,
            mergedPathIp,
            timeStamp
        }

        await produceStats(data)

        next()
    } catch (error) {
        next(error)
    }
};


module.exports = { logStats }