const user = require('./services/users/network');
const validation = require('../middleware/validationHandler');
const config = require('../config');

/**
 * Function that exposes the API routes
 * @param  {} app
 * @param  {} router
 */
module.exports = (app) => {

  app.use(`/api/${config.api.version}/users`, user(validation));

};

