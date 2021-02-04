const app = require('../app');
const request = require('supertest');
const { OK, NOT_FOUND } = require('http-status-codes').StatusCodes;
const fakeProducts = require('../helpers/products.fixture.json');
const fakeComments = require('../helpers/comments.fixture.json');
const fakeProfile = require('../helpers/profile.fixture.json');

describe('Routes', () => {
    test('It should fetch /\products and return the data', () => {
        request(app)
            .get('/products')
            .then(response => {
                expect(response.statusCode).toBe(OK)
                expect(response.body).toEqual(fakeProducts)
            })
    })

    test('It should fetch /\comments and return the data', () => {
        request(app)
            .get('/products')
            .then(response => {
                expect(response.statusCode).toBe(OK)
                expect(response.body).toEqual(fakeComments)
            })
    })

    test('It should fetch /\profile and return the data', () => {
        request(app)
            .get('/products')
            .then(response => {
                expect(response.statusCode).toBe(OK)
                expect(response.body).toEqual(fakeProfile)
            })
    })

    test('It should return the status code of 404 - NOT FOUND for wrong path', () => {
        request(app)
            .get('/randomPath')
            .then(response => {
                expect(response.statusCode).toBe(NOT_FOUND)
                expect(response.body).toEqual('This route does not exist')
            })
    })
})