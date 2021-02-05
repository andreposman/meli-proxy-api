const rateLimiter = require('../middlewares/rateLimiter');
const request = require('supertest');
const app = require('../server');
const { TOO_MANY_REQUESTS } = require('http-status-codes').StatusCodes;
require('dotenv').config()

describe('Rate Limit', () => {
    test('it should request /products 6 times and be rate-limtited', () => {
        process.env.IP_MAX_WINDOW_REQ_COUNT = 5
        let reqCount = 0
        while (reqCount <= 6) {
            request(app)
                .get('/products')
                .then(response => {
                    expect(response.statusCode).toBe(TOO_MANY_REQUESTS)
                })
            reqCount++
        }
    })

    test('it should request /profile 6 times and be rate-limtited', () => {
        process.env.IP_MAX_WINDOW_REQ_COUNT = 5
        let reqCount = 0
        while (reqCount <= 6) {
            request(app)
                .get('/profile')
                .then(response => {
                    expect(response.statusCode).toBe(TOO_MANY_REQUESTS)
                })
            reqCount++
        }
    })

    test('it should request /comments 6 times and be rate-limtited', () => {
        process.env.IP_MAX_WINDOW_REQ_COUNT = 5
        let reqCount = 0
        while (reqCount <= 6) {
            request(app)
                .get('/comments')
                .then(response => {
                    expect(response.statusCode).toBe(TOO_MANY_REQUESTS)
                })
            reqCount++
        }
    })
})
