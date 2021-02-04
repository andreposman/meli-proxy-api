const redisMock = require("redis-mock");
const redis = require('redis')

describe("redis", () => {
    test('It should create a redis client', () => {
        const client = redisMock.createClient()
        expect(client).toEqual(redis.createClient())
    })

});