const { check, oneOf, validationResult } = require('express-validator');
const path = require('../helpers/path.stub.json');

const pathValidator = (req, res, next) => {
    const userPath = req.path
    const url = req.baseUrl

    check(url)
        .isURL()
        .bail()

    next()
}

const headerValidator = (req, res, next) => {
    
}

module.exports = pathValidator