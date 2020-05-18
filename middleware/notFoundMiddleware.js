const boom = require('@hapi/boom');

/**
 * Middleware that shows an error if route doesn't exists.
 *
 * @param {*} req
 * @param {*} res
 */
function notFoundMiddleware(req, res) {
  const {
    output: { statusCode, payload },
  } = boom.notFound();

  res.status(statusCode).json(payload);
}

module.exports = notFoundMiddleware;
