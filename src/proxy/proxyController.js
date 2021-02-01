const jsend = require('jsend');
const {FORBIDDEN} = require('http-status-codes').StatusCodes;
const service = require('./proxyService');
const fakeData = require('../helpers/fakeData.json');

module.exports = {
    redirectUser(req, res, next) {
        // const url = req.originalUrl
        // const path = req.path
        // const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
        // const mergeIpPath = ip + path

        if (req.headers['isBlocked']) {
            res
                .status(FORBIDDEN)
                .jsend.error("Blocked");
        }
        else{
            res.redirect("http://localhost:3001/posts")
        }
    }
}
