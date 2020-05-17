const createUserHandler = require('./handlers/createUserHandler');
const createCredentialsHandler = require('./handlers/createCredentialsHandler');
const sendWelcomeEmailHandler = require('./handlers/sendWelcomeEmailHandler');
const queryParamsHandler = require('./handlers/queryParamsHandler');
const paginationHandler = require('./handlers/paginationHandler');
const loginUserHandler = require('./handlers/loginUser');
const updateObjectHandler = require('./handlers/updateObjectHandler');
const AWS = require('../../../lib/AWS');

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
   * @returns {{loginUser: loginUser, insertUser: (function(*): *)}} CRUD functions
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
      throw new Error(error);
    }
  }

  /**
   * Function that list the active users using pagination by sending the number of the page.
   * If user doesn't send the page parameter by default starts in 1.
   *
   * @param {*} query
   * @returns Promise<{ users: {} }>}
   */
  async function listUsers(query) {

    try {
      const { page = 1 } = query;

      const searchQuery = queryParamsHandler(query);
      const pagination = await paginationHandler(page, store, TABLE, searchQuery);
      const users = await store.list(TABLE, searchQuery, pagination);

      return ({
        users,
        totalPages: pagination.totalPages,
        currentPage: parseInt(page, 10),
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  /**
   * Function that receives the userId and returns the user object or an empty object if user not exists in DB.
   *
   * @param {*} userId
   * @returns {Promise<{ user: {}}>}
   */
  async function getUser(userId) {

    try {
      const user = await store.get(TABLE, userId);
      return user || {};
    } catch (error) {
      throw new Error(error);
    }
  }

  /**
   * Function that receives the userId and delete it.
   *
   * @param {*} userId
   * @returns {Promise<{ updatedId: String, updatedCount: number }>}
   */
  async function updateUser(userId, userData) {

    try {
      const updateUser = updateObjectHandler(userData);
      const updatedCount = await store.update(TABLE, userId, updateUser);
      return updatedCount;
    } catch (error) {
      throw new Error(error);
    }
  }

  /**
 * Function that receives the userId and delete its user.
 *
 * @param {*} userId
 *
 * @returns {Promise<{ deletedId: String, deletedCount: number }>}
 */
  async function deleteUser(userId) {

    try {
      const deletedCount = await store.delete(TABLE, userId);
      return deletedCount;
    } catch (error) {
      throw new Error(error);
    }
  }

  /**
 * Validate if user is successfully logged.
 *
 * @param user
 * @returns {Promise<{jwt: (*|undefined)}|{result: number, message: string, status: number}>}
 */
  async function loginUser(user) {
    if (!user) {
      throw new Error('User is required');
    }
    return loginUserHandler(user, store, TABLE);
  }

  /**
   * Function that receives the userId and a property and returns property object of the userId.
   *
   * @param {*} userId
   * @returns {Promise<{ user: {profile: {}}}>}
   */
  async function getUserProperty(userId, property) {

    try {
      const projection = {};
      projection[property] = 1;

      const user = await store.get(TABLE, userId, projection);

      return user[property] !== undefined ? user : `Property "${property}" doesn't exists in user`;

    } catch (error) {
      throw new Error(error);
    }
  }

  /**
   * Get a buffer file a send to S3 bucket, and return data image from S3
   *
   * @param file
   * @param username
   * @returns {Promise<void>}
   */
  async function uploadImage(file, username) {
    const aws = new AWS();
    return aws.uploadFile(file, username);
  }

  return {
    insertUser,
    listUsers,
    getUser,
    updateUser,
    deleteUser,
    loginUser,
    getUserProperty,
    uploadImage,
  };
};
