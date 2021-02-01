const moment = require('moment')
const redis = require('redis')
const ERROR_MESSAGES = require('../helpers/messages');
const proxyRules = require('../../proxyRules.json');

const redisClient = redis.createClient({ host: 'redis' });

const IP_WINDOW_SIZE_IN_SECONDS = process.env.IP_WINDOW_LOG_INTERVAL_SECS;
const IP_MAX_WINDOW_REQUEST_COUNT = process.env.IP_MAX_WINDOW_REQ_COUNT;
const IP_WINDOW_LOG_INTERVAL_IN_SECONDS = process.env.IP_WINDOW_LOG_INTERVAL_SECS;

const PATH_WINDOW_SIZE_IN_SECONDS = process.env.PATH_WINDOW_SIZE_SECS;
const PATH_MAX_WINDOW_REQUEST_COUNT = process.env.PATH_MAX_WINDOW_REQ_COUNT;
const PATH_WINDOW_LOG_INTERVAL_IN_SECONDS = process.env.PATH_WINDOW_LOG_INTERVAL_SECS;

const IP_PATH_WINDOW_SIZE_IN_SECONDS = process.env.IP_PATH_WINDOW_SIZE_SECS;
const IP_PATH_MAX_WINDOW_REQUEST_COUNT = process.env.IP_PATH_MAX_WINDOW_REQ_COUNT;
const IP_PATH_WINDOW_LOG_INTERVAL_IN_SECONDS = process.env.IP_PATH_WINDOW_LOG_INTERVAL_SECS;


const rateLimitByIp = (req, res, next) => {
    try {
        if (!redisClient) {
            throw new Error('Redis client does not exist!');
            process.exit(1);
        }
        // fetch records of current user using IP address, returns null when no record is found
        redisClient.get(req.ip, function (err, record) {
            if (err) throw err;
            const currentRequestTime = moment();
            //  if no record is found , create a new record for user and store to redis
            console.log('record', record);
            if (record == null) {
                console.log('to no if');
                let newRecord = [];
                let requestLog = {
                    requestTimeStamp: currentRequestTime.unix(),
                    requestCount: 1
                };
                newRecord.push(requestLog);
                redisClient.set(req.headers.host, JSON.stringify(newRecord));
                next();
            } else {
                console.log('to no else');
                // if record is found, parse it's value and calculate number of requests users has made within the last window
                let data = JSON.parse(record);

                let windowStartTimestamp = moment()
                    .subtract(IP_WINDOW_SIZE_IN_SECONDS, 'seconds')
                    .unix();

                console.log('windowStartTimestamp', windowStartTimestamp);

                let requestsWithinWindow = data.filter(entry => {
                    return entry.requestTimeStamp > windowStartTimestamp;
                });
                console.log('requestsWithinWindow', requestsWithinWindow);
                let totalWindowRequestsCount = requestsWithinWindow.reduce((accumulator, entry) => {
                    return accumulator + entry.requestCount;
                }, 0);

                console.log('totalWindowRequestsCount', totalWindowRequestsCount);

                // if number of requests made is greater than or equal to the desired maximum, return error
                if (totalWindowRequestsCount >= IP_MAX_WINDOW_REQUEST_COUNT) {
                    res
                        .status(ERROR_MESSAGES.BLOCKED_IP.status)
                        .jsend.error(
                            ERROR_MESSAGES.BLOCKED_IP.message, IP_MAX_WINDOW_REQUEST_COUNT, IP_WINDOW_SIZE_IN_SECONDS
                        );
                    // .jsend.error(
                    //     `You have exceeded the ${IP_MAX_WINDOW_REQUEST_COUNT} requests in ${IP_WINDOW_SIZE_IN_SECONDS} seconds limit!`
                    // );
                } else {
                    req.headers['isBlocked'] = false
                    // if number of requests made is less than allowed maximum, log new entry
                    let lastRequestLog = data[data.length - 1];
                    let potentialCurrentWindowIntervalStartTimeStamp = currentRequestTime
                        .subtract(IP_WINDOW_LOG_INTERVAL_IN_SECONDS, 'seconds')
                        .unix();
                    //  if interval has not passed since last request log, increment counter
                    if (lastRequestLog.requestTimeStamp > potentialCurrentWindowIntervalStartTimeStamp) {
                        lastRequestLog.requestCount++;
                        data[data.length - 1] = lastRequestLog;
                    } else {
                        //  if interval has passed, log new entry for current user and timestamp
                        data.push({
                            requestTimeStamp: currentRequestTime.unix(),
                            requestCount: 1
                        });
                    }
                    redisClient.set(req.ip, JSON.stringify(data));
                    next();
                }
            }

        });
    } catch (error) {
        req.headers['isBlocked'] = true
        next(error);
    }
};

const rateLimitByPath = (req, res, next) => {
    try {
        //validatePath
        if (!redisClient) {
            throw new Error('Redis client does not exist!');
            process.exit(1);
        }
        // fetch records of current user using path address, returns null when no record is found
        redisClient.get(req.path, function (err, record) {
            if (err) throw err;
            const currentRequestTime = moment();
            //  if no record is found , create a new record for user and store to redis
            console.log('record', record);
            if (record == null) {
                console.log('to no if');
                let newRecord = [];
                let requestLog = {
                    requestTimeStamp: currentRequestTime.unix(),
                    requestCount: 1
                };
                newRecord.push(requestLog);
                redisClient.set(req.path, JSON.stringify(newRecord));
                next();
            } else {
                console.log('to no else');
                // if record is found, parse it's value and calculate number of requests users has made within the last window
                let data = JSON.parse(record);

                let windowStartTimestamp = moment()
                    .subtract(PATH_WINDOW_SIZE_IN_SECONDS, 'seconds')
                    .unix();

                console.log('windowStartTimestamp', windowStartTimestamp);

                let requestsWithinWindow = data.filter(entry => {
                    return entry.requestTimeStamp > windowStartTimestamp;
                });
                console.log('requestsWithinWindow', requestsWithinWindow);
                let totalWindowRequestsCount = requestsWithinWindow.reduce((accumulator, entry) => {
                    return accumulator + entry.requestCount;
                }, 0);

                console.log('totalWindowRequestsCount', totalWindowRequestsCount);

                // if number of requests made is greater than or equal to the desired maximum, return error
                if (totalWindowRequestsCount >= PATH_MAX_WINDOW_REQUEST_COUNT) {
                    res
                        .status(ERROR_MESSAGES.BLOCKED_PATH.status)
                        .jsend.error(
                            ERROR_MESSAGES.BLOCKED_PATH.message);
                } else {
                    req.headers['isBlocked'] = false
                    // if number of requests made is less than allowed maximum, log new entry
                    let lastRequestLog = data[data.length - 1];
                    let potentialCurrentWindowIntervalStartTimeStamp = currentRequestTime
                        .subtract(PATH_WINDOW_LOG_INTERVAL_IN_SECONDS, 'seconds')
                        .unix();
                    //  if interval has not passed since last request log, increment counter
                    if (lastRequestLog.requestTimeStamp > potentialCurrentWindowIntervalStartTimeStamp) {
                        lastRequestLog.requestCount++;
                        data[data.length - 1] = lastRequestLog;
                    } else {
                        //  if interval has passed, log new entry for current user and timestamp
                        data.push({
                            requestTimeStamp: currentRequestTime.unix(),
                            requestCount: 1
                        });
                    }
                    redisClient.set(req.path, JSON.stringify(data));
                    next();
                }
            }

        });
    } catch (error) {
        req.headers['isBlocked'] = true
        next(error);
    }
};

const rateLimitByPathIp = (req, res, next) => {
    try {
        const mergedPathIp = req.ip + req.path || 'NOT_FOUND'

        console.log(mergedPathIp);
        if (!redisClient) {
            throw new Error('Redis client does not exist!');
            process.exit(1);
        }
        // fetch records of current user using path address, returns null when no record is found
        redisClient.get(mergedPathIp, function (err, record) {
            if (err) throw err;
            const currentRequestTime = moment();
            //  if no record is found , create a new record for user and store to redis
            console.log('record', record);
            if (record == null) {
                console.log('to no if');
                let newRecord = [];
                let requestLog = {
                    requestTimeStamp: currentRequestTime.unix(),
                    requestCount: 1
                };
                newRecord.push(requestLog);
                redisClient.set(mergedPathIp, JSON.stringify(newRecord));
                next();
            } else {
                // if record is found, parse it's value and calculate number of requests users has made within the last window
                let data = JSON.parse(record);

                let windowStartTimestamp = moment()
                    .subtract(IP_PATH_WINDOW_SIZE_IN_SECONDS, 'seconds')
                    .unix();

                console.log('windowStartTimestamp', windowStartTimestamp);

                let requestsWithinWindow = data.filter(entry => {
                    return entry.requestTimeStamp > windowStartTimestamp;
                });
                console.log('requestsWithinWindow', requestsWithinWindow);
                let totalWindowRequestsCount = requestsWithinWindow.reduce((accumulator, entry) => {
                    return accumulator + entry.requestCount;
                }, 0);

                console.log('totalWindowRequestsCount', totalWindowRequestsCount);

                // if number of requests made is greater than or equal to the desired maximum, return error
                if (totalWindowRequestsCount >= IP_PATH_MAX_WINDOW_REQUEST_COUNT) {
                    res
                        .status(ERROR_MESSAGES.BLOCKED_PATH.status)
                        .jsend.error(
                            ERROR_MESSAGES.BLOCKED_PATH.message);
                } else {
                    req.headers['isBlocked'] = false
                    // if number of requests made is less than allowed maximum, log new entry
                    let lastRequestLog = data[data.length - 1];
                    let potentialCurrentWindowIntervalStartTimeStamp = currentRequestTime
                        .subtract(IP_PATH_WINDOW_LOG_INTERVAL_IN_SECONDS, 'seconds')
                        .unix();
                    //  if interval has not passed since last request log, increment counter
                    if (lastRequestLog.requestTimeStamp > potentialCurrentWindowIntervalStartTimeStamp) {
                        lastRequestLog.requestCount++;
                        data[data.length - 1] = lastRequestLog;
                    } else {
                        //  if interval has passed, log new entry for current user and timestamp
                        data.push({
                            requestTimeStamp: currentRequestTime.unix(),
                            requestCount: 1
                        });
                    }
                    redisClient.set(mergedPathIp, JSON.stringify(data));
                    next();
                }
            }

        });
    } catch (error) {
        req.headers['isBlocked'] = true
        next(error);
    }
};


module.exports = { rateLimitByIp, rateLimitByPath, rateLimitByPathIp }