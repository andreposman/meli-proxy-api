const { OK, NOT_FOUND } = require('http-status-codes').StatusCodes;
const fakeProducts = require('../helpers/products.json');
const fakeProfile = require('../helpers/profile.json');
const fakeComments = require('../helpers/comments.json');

module.exports = {
    redirectUser(req, res, next) {
        try {
            switch (req.path) {
                case '/products':
                    return res
                        .status(OK)
                        .json(fakeProducts)
                    break;
                case '/profile':
                    return res
                        .status(OK)
                        .json(fakeProfile)
                    break;
                case '/comments':
                    return res
                        .status(OK)
                        .json(fakeComments)
                    break;
                default:
                    res
                        .status(NOT_FOUND)
                        .jsend.error("This route does not exist");
                    break;
            }
        } catch (error) {
            throw error
        }
    }
}
