const server = require('./server');
const request = require('supertest');

describe('APP', () => {
    it('should create the app and check /healthcheck', async (done) => {
        const res = await (await request(server).get('/healthcheck').expect(200)).body(` "everything": "is ok"`)

        done()
    })
})