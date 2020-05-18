const passport = require('passport');
const { Strategy, ExtractJwt } = require('passport-jwt');
const config = require('../../config');

const strategyOpts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.jwt.secret,
};

const actionStrategy = (tokenPayload, done) => {
  if (!tokenPayload) {
    throw new Error('Token from authorization not found');
  }
  done(null, { active: tokenPayload.active });
};

passport.use('jwt', new Strategy(strategyOpts, actionStrategy));
