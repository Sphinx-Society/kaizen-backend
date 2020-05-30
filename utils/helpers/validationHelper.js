const joi = require('@hapi/joi');

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

module.exports = validate;
