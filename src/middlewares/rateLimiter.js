const moment = require('moment')
const ERROR_MESSAGES = require('../helpers/messages');
const client = require('../db/redis');
require('dotenv').config()

const IP_WINDOW_SIZE_IN_SECONDS = process.env.IP_WINDOW_SIZE_SECS;
const IP_MAX_WINDOW_REQUEST_COUNT = process.env.IP_MAX_WINDOW_REQ_COUNT;
const IP_WINDOW_LOG_INTERVAL_IN_SECONDS = process.env.IP_WINDOW_LOG_INTERVAL_SECS;

const PATH_WINDOW_SIZE_IN_SECONDS = process.env.PATH_WINDOW_SIZE_SECS;
const PATH_MAX_WINDOW_REQUEST_COUNT = process.env.PATH_MAX_WINDOW_REQ_COUNT;
const PATH_WINDOW_LOG_INTERVAL_IN_SECONDS = process.env.PATH_WINDOW_LOG_INTERVAL_SECS;

const IP_PATH_WINDOW_SIZE_IN_SECONDS = process.env.IP_PATH_WINDOW_SIZE_SECS;
const IP_PATH_MAX_WINDOW_REQUEST_COUNT = process.env.IP_PATH_MAX_WINDOW_REQ_COUNT;
const IP_PATH_WINDOW_LOG_INTERVAL_IN_SECONDS = process.env.IP_PATH_WINDOW_LOG_INTERVAL_SECS;

const rateLimitByIp = (req, res, next) => {
    let ip = req.ip
    let path = req.path
    let mergedPathIp = ip + path

    let userReqData = { ip, path, mergedPathIp }

    try {
        if (!client) {
            throw new Error('Redis client does not exist!');
            process.exit(1);
        }
        client.get(ip, (err, record) => {
            if (err) throw err;
            const currentRequestTime = moment();
            console.log(`\n IP - Record: ${record}`);
            if (record == null) {
                let newRecord = [];
                let requestLog = {
                    requestTimeStamp: currentRequestTime.unix(),
                    userReqData,
                    requestCount: 1
                };

                newRecord.push(requestLog);
                client.set(ip, JSON.stringify(newRecord));

                next();
            } else {
                // calculate req in previous window
                let data = JSON.parse(record);

                let windowStartTimestamp = moment()
                    .subtract(IP_WINDOW_SIZE_IN_SECONDS, 'seconds')
                    .unix();


                let requestsWithinWindow = data.filter(entry => {
                    return entry.requestTimeStamp > windowStartTimestamp;
                });

                console.log(`\n Request in Window: ${requestsWithinWindow}`);

                let totalWindowRequestsCount = requestsWithinWindow.reduce((accumulator, entry) => {
                    return accumulator + entry.requestCount;
                }, 0);

                console.log(`\n Total Reqs in Window: ${totalWindowRequestsCount}`);

                if (totalWindowRequestsCount >= IP_MAX_WINDOW_REQUEST_COUNT) {
                    res
                        .status(ERROR_MESSAGES.BLOCKED_IP.status)
                        .jsend.error(ERROR_MESSAGES.BLOCKED_IP.message, IP_MAX_WINDOW_REQUEST_COUNT, IP_WINDOW_SIZE_IN_SECONDS);

                } else {
                    // num req lower than max, new entry
                    let lastRequestLog = data[data.length - 1];
                    let potentialCurrentWindowIntervalStartTimeStamp = currentRequestTime
                        .subtract(IP_WINDOW_LOG_INTERVAL_IN_SECONDS, 'seconds')
                        .unix();
                    if (lastRequestLog.requestTimeStamp > potentialCurrentWindowIntervalStartTimeStamp) {
                        lastRequestLog.requestCount++;
                        data[data.length - 1] = lastRequestLog;
                    } else {
                        data.push({
                            requestTimeStamp: currentRequestTime.unix(),
                            userReqData,
                            requestCount: 1
                        });
                    }
                    client.set(req.ip, JSON.stringify(data));
                    next();
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

const rateLimitByPath = (req, res, next) => {
    let ip = req.ip
    let path = req.path
    let mergedPathIp = ip + path

    let userReqData = { ip, path, mergedPathIp }

    try {
        if (!client) {
            throw new Error('Redis client does not exist!');
            process.exit(1);
        }
        client.get(path, function (err, record) {
            if (err) throw err;
            const currentRequestTime = moment();
            console.log(`\n Path - Record: ${record}`);

            if (record == null) {
                let newRecord = [];
                let requestLog = {
                    requestTimeStamp: currentRequestTime.unix(),
                    userReqData,
                    requestCount: 1
                };

                newRecord.push(requestLog);
                client.set(path, JSON.stringify(newRecord));

                next();
            } else {
                let data = JSON.parse(record);

                let windowStartTimestamp = moment()
                    .subtract(PATH_WINDOW_SIZE_IN_SECONDS, 'seconds')
                    .unix();

                let requestsWithinWindow = data.filter(entry => {
                    return entry.requestTimeStamp > windowStartTimestamp;
                });

                console.log(`\n Path - Request in Window: ${requestsWithinWindow}`);

                let totalWindowRequestsCount = requestsWithinWindow.reduce((accumulator, entry) => {
                    return accumulator + entry.requestCount;
                }, 0);

                console.log(`\n Path - Total Reqs in Windows: ${totalWindowRequestsCount}`);

                if (totalWindowRequestsCount >= PATH_MAX_WINDOW_REQUEST_COUNT) {
                    res
                        .status(ERROR_MESSAGES.BLOCKED_PATH.status)
                        .jsend.error(ERROR_MESSAGES.BLOCKED_PATH.message);
                } else {
                    let lastRequestLog = data[data.length - 1];
                    let potentialCurrentWindowIntervalStartTimeStamp = currentRequestTime
                        .subtract(PATH_WINDOW_LOG_INTERVAL_IN_SECONDS, 'seconds')
                        .unix();
                    if (lastRequestLog.requestTimeStamp > potentialCurrentWindowIntervalStartTimeStamp) {
                        lastRequestLog.requestCount++;
                        data[data.length - 1] = lastRequestLog;
                    } else {
                        data.push({
                            requestTimeStamp: currentRequestTime.unix(),
                            userReqData,
                            requestCount: 1
                        });
                    }
                    client.set(path, JSON.stringify(data));
                    next();
                }
            }
        });
    }
    catch (error) {
        next(error);
    }
};

const rateLimitByPathIp = (req, res, next) => {
    let ip = req.ip
    let path = req.path
    let mergedPathIp = ip + path

    let userReqData = { ip, path, mergedPathIp }

    try {
        if (!client) {
            throw new Error('Redis client does not exist!');
            process.exit(1);
        }
        client.get(path, function (err, record) {
            if (err) throw err;
            const currentRequestTime = moment();
            console.log(`\n PathIP  - Record: ${record}`);

            if (record == null) {
                let newRecord = [];
                let requestLog = {
                    requestTimeStamp: currentRequestTime.unix(),
                    userReqData,
                    requestCount: 1
                };

                newRecord.push(requestLog);
                client.set(mergedPathIp, JSON.stringify(newRecord));

                next();
            } else {
                let data = JSON.parse(record);

                let windowStartTimestamp = moment()
                    .subtract(IP_PATH_WINDOW_SIZE_IN_SECONDS, 'seconds')
                    .unix();

                let requestsWithinWindow = data.filter(entry => {
                    return entry.requestTimeStamp > windowStartTimestamp;
                });

                console.log(`\n PathIP - Request in Window: ${requestsWithinWindow}`);

                let totalWindowRequestsCount = requestsWithinWindow.reduce((accumulator, entry) => {
                    return accumulator + entry.requestCount;
                }, 0);

                console.log(`\n PathIP - Total Reqs in Windows: ${totalWindowRequestsCount}`);

                if (totalWindowRequestsCount >= IP_PATH_MAX_WINDOW_REQUEST_COUNT) {
                    res
                        .status(ERROR_MESSAGES.BLOCKED_IP_PATH.status)
                        .jsend.error(ERROR_MESSAGES.BLOCKED_IP_PATH.message);
                } else {
                    let lastRequestLog = data[data.length - 1];
                    let potentialCurrentWindowIntervalStartTimeStamp = currentRequestTime
                        .subtract(IP_PATH_WINDOW_LOG_INTERVAL_IN_SECONDS, 'seconds')
                        .unix();
                    if (lastRequestLog.requestTimeStamp > potentialCurrentWindowIntervalStartTimeStamp) {
                        lastRequestLog.requestCount++;
                        data[data.length - 1] = lastRequestLog;
                    } else {
                        data.push({
                            requestTimeStamp: currentRequestTime.unix(),
                            userReqData,
                            requestCount: 1
                        });
                    }
                    client.set(mergedPathIp, JSON.stringify(data));
                    next();
                }
            }
        });
    }
    catch (error) {
        next(error);
    }
};

module.exports = { rateLimitByIp, rateLimitByPath, rateLimitByPathIp }
