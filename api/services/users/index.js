const store = require('../../../store/mongo');
const controller = require('./controller');

const TABLE = 'users';

/**
 * Gives the controller a table name and exports it
 * @param  {} store
 * @param  {} TABLE
 */
module.exports = controller(store, TABLE);
