const boom = require('@hapi/boom');
const Sentry = require('@sentry/node');
const config = require('../config');
const response = require('../network/response');
const LoggerService = require('../lib/logger');

Sentry.init({ dsn: `https://${config.sentry.sentryDns}@o400538.ingest.sentry.io/${config.sentry.sentryId}` });

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
    Sentry.captureException(err);
    const logger = new LoggerService();
    logger.error(err.output.payload.message, {
      output,
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
    next(boom.badRequest(err));
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
function errorMiddleware(err, req, res, next) {
  const { output: { payload } } = err;
  response.fail(req, res, withErrorStack(payload, err.stack), output.statusCode);
}

module.exports = {
  logErrors,
  wrapErrors,
  errorMiddleware,
};
