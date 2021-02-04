const app = require('../app');
const request = require('supertest');

describe('Server', () => {
    test('It should fetch the healthcheck and return status code 200', () => {
        request(app)
            .get('/healthcheck')
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.statusCode).toBe(200)
            })
    })
})