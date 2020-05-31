const passport = require('passport');
const { Strategy, ExtractJwt } = require('passport-jwt');
const config = require('../../config');
const messages = require('../../config/messages');

const strategyOpts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.jwt.secret,
};

const actionStrategy = (tokenPayload, done) => {
  if (!tokenPayload) {
    throw (messages.SSKB_TOKEN_AUTH_NOT_FOUND);
  }
  done(null, { ...tokenPayload });
};

passport.use('jwt', new Strategy(strategyOpts, actionStrategy));
