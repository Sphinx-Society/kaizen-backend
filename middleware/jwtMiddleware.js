const passport = require('passport');
require('../utils/strategies/jwt');

/**
 * Validate if request has an authentication token
 *
 * @param req
 * @param res
 * @param next
 */
module.exports = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (error, user, info) => {
    if (error) return next(error);
    if (!user) {
      return res.status(401).send({
        message: 'Unauthorized',
        statusCode: 401,
      });
    }
    req.payload = user;
    next();
  })(req, res, next);
};
