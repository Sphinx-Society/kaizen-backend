const boom = require('@hapi/boom');
const config = require('../config');
const LoggerService = require('../lib/logger');

/**
 * Middleware that shows the error stack if the environment is different to production and send it to the next middleware.
 *
 * @param {*} error
 * @param {*} stack
 * @returns {Object} error object
 */
function withErrorStack(error, stack) {
  if (!config.server.env === 'PRODUCTION') {
    return { ...error, stack };
  }

  return error;
}

/**
 * Middleware that sends the error to the logger service and send it to the next middleware.
 *
 * @param {*} err
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
function logErrors(err, req, res, next) {

  if (err) {
    const logger = new LoggerService();
    logger.error('[ERROR]', {
      output: { statusCode, payload },
    } = err);

    next(err);
  }
}

/**
 * Middleware that checks if its a boom error, wrapped it and send it to the next middleware.
 *
 * @param {*} err
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
function wrapErrors(err, req, res, next) {
  if (!err.isBoom) {
    next(boom.badImplementation(err));
  }

  next(err);
}

/**
 * Middleware that formats the error and returns it to client.
 *
 * @param {*} err
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
function errorHandler(err, req, res, next) {
  const {
    output: { statusCode, payload },
  } = err;
  res.status(statusCode);
  res.json(withErrorStack(payload, err.stack));
}

module.exports = {
  logErrors,
  wrapErrors,
  errorHandler,
};
