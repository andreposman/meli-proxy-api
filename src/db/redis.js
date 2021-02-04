const redis = require('redis')
const redisClient = redis.createClient({ host: 'redis' });


redisClient.on('error', err => {
    console.log('Error ' + err);
});

module.exports = redisClient