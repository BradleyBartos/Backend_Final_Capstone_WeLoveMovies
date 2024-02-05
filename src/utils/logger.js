const pino = require('pino-http');
const { nanoid } = require("nanoid");

const level = process.env.LOG_LEVEL || "debug"

const logger = pino({
  genReqId: (request) => request.headers['x-request-id'] || nanoid(),
  level
});

module.exports = logger;
