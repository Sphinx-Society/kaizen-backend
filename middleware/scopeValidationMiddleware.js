const boom = require('@hapi/boom');

function scopesValidationHandler(allowedScopes) {
  return function (req, res, next) {
    if (!req.payload || (req.payload.permission === undefined)) {
      next(boom.unauthorized('Missing array permissions'));
    }

    const hasAccess = allowedScopes
      .map((allowedScope) => req.payload.permission.includes(allowedScope))
      .find((allowed) => Boolean(allowed));

    if (hasAccess) {
      next();
    } else {
      next(boom.unauthorized('Insufficient permissions'));
    }
  };
}

module.exports = scopesValidationHandler;
