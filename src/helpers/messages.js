const { TOO_MANY_REQUESTS, FORBIDDEN } = require('http-status-codes').StatusCodes;
require('dotenv').config()


const IP_WINDOW_SIZE_IN_SECONDS = process.env.IP_WINDOW_LOG_INTERVAL_SECS || "ENV_NOT_FOUND";
const IP_MAX_WINDOW_REQUEST_COUNT = process.env.IP_MAX_WINDOW_REQ_COUNT || "ENV_NOT_FOUND";

const PATH_WINDOW_SIZE_IN_SECONDS = process.env.PATH_WINDOW_SIZE_SECS || "ENV_NOT_FOUND";
const PATH_MAX_WINDOW_REQUEST_COUNT = process.env.PATH_MAX_WINDOW_REQ_COUNT || "ENV_NOT_FOUND";

const IP_PATH_WINDOW_SIZE_IN_SECONDS = process.env.IP_PATH_WINDOW_SIZE_SECS || "ENV_NOT_FOUND";
const IP_PATH_MAX_WINDOW_REQUEST_COUNT = process.env.IP_PATH_MAX_WINDOW_REQ_COUNT || "ENV_NOT_FOUND";

const ERROR_MESSAGES = {
    BLOCKED_IP: {
        status: TOO_MANY_REQUESTS,
        message: `The ${IP_MAX_WINDOW_REQUEST_COUNT} requests that you made, are too many! You are blocked for ${IP_WINDOW_SIZE_IN_SECONDS} seconds.`
    },
    BLOCKED_PATH: {
        status: TOO_MANY_REQUESTS,
        message: `The ${PATH_MAX_WINDOW_REQUEST_COUNT} requests that you made, are too many! You are blocked for ${PATH_WINDOW_SIZE_IN_SECONDS} seconds.`
    },
    BLOCKED_IP_PATH: {
        status: TOO_MANY_REQUESTS,
        message: `The ${IP_PATH_WINDOW_SIZE_IN_SECONDS} requests that you made, are too many! You are blocked for ${IP_PATH_MAX_WINDOW_REQUEST_COUNT} seconds.`
    },
    BLACK_LISTED: {
        status: FORBIDDEN,
        message: `You are blacklisted.`
    }
}

module.exports = ERROR_MESSAGES