const user = require('./services/users/network');
const template = require('./services/templates/network');
const validation = require('../middleware/validationMiddleware');
const config = require('../config');

/**
 * Function that exposes the API routes
 * @param  {} app
 * @param  {} router
 */
module.exports = (app) => {

  app.use(`/api/${config.api.version}/users`, user(validation));
  app.use(`/api/${config.api.version}/templates`, template(validation));

};

