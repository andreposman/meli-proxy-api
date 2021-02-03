const { FORBIDDEN, NOT_FOUND } = require('http-status-codes').StatusCodes;
const fakeProducts = require('../helpers/products.json');
const fakeProfile = require('../helpers/profile.json');
const fakeComments = require('../helpers/comments.json');

module.exports = {
    redirectUser(req, res, next) {
        try {
            if (req.headers['isBlocked']) {
                res
                    .status(FORBIDDEN)
                    .jsend.error("Blocked");
            }
            else {
                switch (req.path) {
                    case '/products':
                        return res.json(fakeProducts)
                        break;
                    case '/profile':
                        return res.json(fakeProfile)
                        break;
                    case '/comments':
                        return res.json(fakeComments)
                        break;

                    default:
                        res
                            .status(NOT_FOUND)
                            .jsend.error("This route does not exist");
                        break;
                }
            }

        } catch (error) {
            throw error
        }

    }
}
