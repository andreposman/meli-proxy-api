const moment = require('moment')
const produceStats = require('./producer');


const logStats = (req, res, next) => {
    try {
        const timeStamp = moment().unix()
        const mergedPathIp = req.ip + req.path
        
        const data = {
            ip: req.ip,
            path: req.path,
            mergedPathIp,
            timeStamp
        }

        produceStats(data)
    } catch (error) {
        next(error)
    }

    next()
};


module.exports = { logStats }