const app = require('../app');
const request = require('supertest');
const {OK, NOT_FOUND} = require('http-status-codes').StatusCodes;

describe('Routes', () => {
    test('It should fetch /\products and return the data', () => {
        request(app)
            .get('/products')
            .then(response => {
                expect(response.statusCode).toBe(OK)
            })
    })

    test('It should fetch /\comments and return the data', () => {
        request(app)
            .get('/comments')
            .then(response => {
                expect(response.statusCode).toBe(OK)
            })
    })

    test('It should fetch /\profile and return the data', () => {
        request(app)
            .get('/profile')
            .then(response => {
                expect(response.statusCode).toBe(OK)
            })
    })

    test('It should return 404 - NOT FOUND for wrong path', () => {
        request(app)
            .get('/randomPath')
            .then(response => {
                expect(response.statusCode).toBe(NOT_FOUND)
            })
    })
})