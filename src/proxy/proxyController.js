const {FORBIDDEN} = require('http-status-codes').StatusCodes;

module.exports = {
    redirectUser(req, res, next) {
        
        if (req.headers['isBlocked']) {
            res
                .status(FORBIDDEN)
                .jsend.error("Blocked");
        }
        else{
            res.send("deu bom")
        }
    }
}
