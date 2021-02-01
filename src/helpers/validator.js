const _ = require('lodash');
const path = require('../helpers/path.stub.json');

const pathValidator = (req, res, next) => {
    const userPath = req.path

    console.log(`User Path: ${userPath} vs. ${path}`);
    // _.some(path, (userPath) => {
    //     next()
    // })
    next()
}

module.exports = pathValidator