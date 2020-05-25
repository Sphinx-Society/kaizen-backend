const createUserHandler = require('./handlers/createUserHandler');
const createCredentialsHandler = require('./handlers/createCredentialsHandler');
const sendWelcomeEmailHandler = require('./handlers/sendWelcomeEmailHandler');
const queryParamsHandler = require('./handlers/queryParamsHandler');
const paginationHandler = require('./handlers/paginationHandler');
const loginUserHandler = require('./handlers/loginUser');
const updateObjectHandler = require('../shared/handlers/updateObjectHandler');
const createUserTestHandler = require('./handlers/createUserTestHandler');
const projectionHandler = require('./handlers/projectionHandler');
const objectIdHandler = require('../shared/handlers/objectIdHandler');
const prefixHandler = require('./handlers/prefixHandler');
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

      const mailId = await sendWelcomeEmailHandler({
        email,
        credentials,
      });

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
      const id = objectIdHandler(userId);
      const updateUser = updateObjectHandler(userData);

      const updatedCount = await store.update(TABLE, id, updateUser);
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
      const updatedAt = Date.now();
      const id = objectIdHandler(userId);
      // const deletedCount = await store.delete(TABLE, userId);
      const deletedCount = await store.update(TABLE, id,
        { 'auth.active': false, updatedAt });
      return deletedCount;
    } catch (error) {
      throw new Error(error);
    }
  }

  /**
   * Function that add a medical test to user
   *
   * @param {*} userId
   * @param {*} userData
   * @returns Promise<{ tests: Object; }>
   */
  async function addTestToUser(userId, userData) {

    try {

      const updatedAt = Date.now();
      const id = objectIdHandler(userId);
      const updatedData = await createUserTestHandler(store, TABLE, userId, userData);

      const updatedCount = await store.update(TABLE, id, { updatedAt }, updatedData);
      return updatedCount;
    } catch (error) {
      throw new Error(error);
    }
  }

  /**
   * Function that deletes the user test by its id, as long as the test doesn't have results.
   *
   * @param {String} userTestId
   *
   * @returns {Promise<{ deletedId: String, deletedCount: number }>}
   */
  async function deleteUserTest(userTestId) {

    try {

      const updatedAt = Date.now();

      const existsResults = await store.findAndCount(TABLE, { 'tests': { $elemMatch: { 'testId': userTestId, 'results': { $exists: true } } } });

      if (existsResults >= 1) {
        return 'Cannot delete because it has results';
      }
      const deletedCount = await store.update(TABLE, { 'tests.testId': userTestId }, {
        'tests.$.status': 'INACTIVE',
        updatedAt,
      });

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
  async function getUserProperty(userId, property, filter) {

    try {

      const queryProjection = projectionHandler(property, filter);

      const user = await store.get(TABLE, userId, queryProjection);

      if (!user) return 'User doesn\'t exists';

      return user[property] !== undefined ? { ...user } : `Property "${property}" doesn't exists in user`;
    } catch (error) {
      throw new Error(error);
    }
  }

  /**
   * Function that retrieves all tests that match with a filter. Filter can be status = ['D', 'P']
   *
   * @param {*} userId
   * @param {*} property
   * @param {*} filter
   * @returns
   */
  async function getTests(userId, property, filter) {
    try {

      const id = objectIdHandler(userId);
      const queryProjection = projectionHandler(property, filter);
      const operation = [{ $match: id }, { ...queryProjection }];

      const [result] = await store.aggregate(TABLE, operation);

      return result;
    } catch (error) {
      throw new Error(error);
    }
  }

  /**
   * Function that retrieves the results of an specific user medical test
   *
   * @param {String} userId
   * @param {String} testId
   * @returns {Object} results
   */
  async function getTestResults(userId, testId) {

    try {
      const id = objectIdHandler(userId);
      const queryProjection = projectionHandler('results', { id, testId });

      const [result] = await store.aggregate(TABLE, queryProjection);

      if (!result) return null;

      return result._id;
    } catch (error) {
      throw new Error(error);
    }
  }

  /**
 * Make a request to MongoDB in order to update a medical test info, if data was be updated,
 * the response have a property updatedCount with value 1 otherwise «zero»
 *
 * @param {String} testsId
 * @param {Object}testData
 * @return {Promise<*>}
 */
  async function updateMedicalTest(testsId, testData) {
    try {
      const updateUser = prefixHandler('tests', testData);
      return await store.update(TABLE, { 'tests.testId': testsId }, updateUser);
    } catch (error) {
      throw new Error(error);
    }
  }

  /**
   * Update data in MongoDB from test result
   * @param {String} testsId
   * @param  {Object} testResultsData
   * @return {Promise<*>}
   */
  async function upsertMedicalResultsData(testsId, testResultsData) {
    try {
      if (Object.entries(testResultsData).length === 0) throw new Error('Object to update must not be empty');

      if (!Object.entries(testResultsData)[0].includes('results')) throw new Error('Object to update must contain results key');

      const updateResults = prefixHandler('tests', testResultsData);
      return await store.update(TABLE, { 'tests.testId': testsId }, updateResults);
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
    getTests,
    addTestToUser,
    deleteUserTest,
    uploadImage,
    updateMedicalTest,
    getTestResults,
    upsertMedicalResultsData,
  };
};
