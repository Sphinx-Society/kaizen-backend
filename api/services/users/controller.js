const createUserHandler = require('./handlers/createUserHandler');
const createCredentialsHandler = require('./handlers/createCredentialsHandler');
const sendWelcomeEmailHandler = require('./handlers/sendWelcomeEmailHandler');

/**
 * Controller that validate the request information and sends it to the store
 * @param  {} injectedStore
 * @param  {} TABLE
 * @returns {} CRUD functions
 */
module.exports = function (InjectedStore, TABLE) {
  const store = new InjectedStore();

  /**
   * Function that insert a user in database, create it's credentials and sends a welcome email with auth information.
   *
   * @param {*} user
   * @returns {Object} Results object
   */

  async function insertUser(user) {

    try {

      if (!user) {
        throw new Error('Invalid User');
      }

      const { email } = user.auth;

      let credentials = await createCredentialsHandler(user);

      if (!credentials) {
        throw new Error('Invalid User');
      }

      const createdUser = await createUserHandler(user, credentials);

      if (!createdUser) {
        throw new Error('Invalid User');
      }
      const userInserted = await store.insert(TABLE, createdUser);

      const mailId = await sendWelcomeEmailHandler({ email, credentials });

      if (!mailId) {
        throw new Error('Email couldn\'t sent');
      }

      credentials = {};
      return userInserted;

    } catch (error) {
      return error;
    }
  }

  /**
   * Function that list the active users. It can receive a query to filter the search.
   *
   * @param {*} query
   * @returns Promise of retrieve the filtered list of users.
   */
  async function listUsers(query) {

    searchQuery = { ...query, 'auth.active': true };
    const users = await store.list(TABLE, searchQuery);
    return users;
  }

  return {
    insertUser,
    listUsers,
  };
};

