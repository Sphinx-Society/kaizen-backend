const joi = require('@hapi/joi');
const boom = require('@hapi/boom');

/**
 * Function that validate the request against schema.
 * @param {*} data
 * @param {*} schema
 * @returns {*} error object
 */
function validate(data, schema) {
  const { error } = joi.object(schema).validate(data);
  return error;
}

/**
 * Middleware that call validate function and return bad request error if request doesn't match with schema.
 *
 * @param {*} schema
 * @param {string} [check='body']
 * @returns function
 */
function validationHandler(schema, check = 'body') {
  return function (req, res, next) {
    const error = validate(req[check], schema);
    error ? next(boom.badRequest(error)) : next();
  };
}

module.exports = validationHandler;
