const boom = require('@hapi/boom');
const messages = require('../config/messages');

function scopesValidationHandler(allowedScopes) {
  return function (req, res, next) {
    try {

      if (!req.payload || (req.payload.permission === undefined)) {
        next(boom.unauthorized(messages.SSKB_ERROR_ARRAY_PERMISSIONS));
        throw (boom.unauthorized(messages.SSKB_ERROR_INSUFFICIENT_PERMISSIONS));
      }

      const hasAccess = allowedScopes
        .map((allowedScope) => req.payload.permission.includes(allowedScope))
        .find((allowed) => Boolean(allowed));

      if (hasAccess) {
        next();
      } else {
        next(boom.unauthorized(messages.SSKB_ERROR_ARRAY_PERMISSIONS));
        throw (boom.unauthorized(messages.SSKB_ERROR_INSUFFICIENT_PERMISSIONS));
      }
    } catch (error) {
      throw (boom.unauthorized(messages.SSKB_ERROR_INSUFFICIENT_PERMISSIONS));
    }
  };
}

module.exports = scopesValidationHandler;
