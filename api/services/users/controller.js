const fs = require('fs');
const ObjectsToCsv = require('objects-to-csv');
const papa = require('papaparse');
const createUserHandler = require('./handlers/createUserHandler');
const createCredentialsHandler = require('./handlers/createCredentialsHandler');
const { sendWelcomeEmailHandler, sendRestPasswordEmailHandler } = require('./handlers/sendEmailHandler');
const queryParamsHandler = require('./handlers/queryParamsHandler');
const paginationHandler = require('../shared/handlers/paginationHandler');
const loginUserHandler = require('./handlers/loginUser');
const updateObjectHandler = require('../shared/handlers/updateObjectHandler');
const createUserTestHandler = require('./handlers/createUserTestHandler');
const { projectionHandler, pdfProjectionHandler } = require('./handlers/projectionHandler');
const objectIdHandler = require('../shared/handlers/objectIdHandler');
const prefixHandler = require('./handlers/prefixHandler');
const createPasswordHandler = require('./handlers/createPasswordHandler');
const AWS = require('../../../lib/AWS');
const validate = require('../../../utils/helpers/validationHelper');
const messages = require('../../../config/messages');
const { validateFileMimeTypes } = require('../../../utils/helpers/validateMimeTypeHelper');

const {
  createUserSchema,
} = require('./schema');

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
     * @param {string} user
     * @param {{}} createdBy Object that includes the information from the user that is doing the request
     * @returns {{loginUser: loginUser, insertUser: (function(*): *)}} CRUD functions
     */
  async function insertUser(user, createdBy) {

    try {

      if (!user) {
        throw (messages.SSKB_ERROR_INVALID_USER);
      }

      const { email } = user.auth;

      let credentials = await createCredentialsHandler(user);

      if (!credentials) {
        throw (messages.SSKB_ERROR_INVALID_USER);
      }

      const createdUser = await createUserHandler(user, credentials, createdBy);

      if (!createdUser) {
        throw (messages.SSKB_ERROR_INVALID_USER);
      }

      if (user.profile.avatar && user.profile.avatar !== '') {
        const aws = new AWS();
        const upload = await aws.uploadAvatar(user.profile.avatar, createdUser.auth.username, user.profile.avatarMimeType);
        if (upload) {
          createdUser.profile.avatar = upload.Location;
        } else {
          createdUser.profile.avatar = '';
        }
        delete createdUser.profile.avatarMimeType;
      }

      const userInserted = await store.insert(TABLE, createdUser);

      const mailId = await sendWelcomeEmailHandler({
        email,
        credentials,
      });

      if (!mailId) {
        throw (messages.SSKB_ERROR_COULDNT_SEND_MAIL);
      }

      credentials = {};
      return userInserted;

    } catch (error) {
      throw new Error(error);
    }
  }

  async function insertUsers(usersFile, createdBy) {

    if (!validateFileMimeTypes(usersFile.mimetype)) throw (messages.SSKB_ERROR_FILE_MIMETYPE);

    return new Promise((resolve, reject) => {
      const parseStream = papa.parse(papa.NODE_STREAM_INPUT, { header: true });

      const filePath = usersFile.path;
      const fileStream = fs.createReadStream(filePath);

      let count = 1;
      const usersWithErrors = [];
      const usersToBeInsert = [];
      parseStream.on('data', async (row) => {

        count += 1;

        const user = {
          profile: {
            firstName: row.firstName,
            lastName: row.lastName,
            birthDate: Math.round((new Date(row.birthDate)).getTime() / 1000),
            phoneNumber: row.phoneNumber,
            gender: row.gender,
            country: row.country,
            documentId: row.documentId,
          },
          auth: {
            email: row.email,
            role: row.role.toLowerCase(),
          },
        };

        const error = validate(user, createUserSchema);
        if (error) {
          userError = { ...row, error: `Line ${count} - ${error.details[0].message}` };
          usersWithErrors.push(userError);
        } else {
          usersToBeInsert.push(user);
        }
      });

      parseStream.on('finish', async () => {
        try {

          /* Do not remove or change this for, if foreach is used, it can't await for the callback to finish.
             For further reading please see https://stackoverflow.com/questions/37576685/using-async-await-with-a-foreach-loop
            */
          // eslint-disable-next-line no-restricted-syntax
          for (const user of usersToBeInsert) {
            // eslint-disable-next-line no-await-in-loop
            const results = await insertUser(user, createdBy);
            if (results.insertedCount === 0) {
              const userError = {
                ...user.profile,
                ...user.auth,
                error: messages.SSKB_ERROR_MONGO_INSERTION,
              };
              usersWithErrors.push(userError);
            }
          }
          const csv = new ObjectsToCsv(usersWithErrors);
          errorFilePath = './tmp/test.csv';
          csv.toDisk(errorFilePath)
            .then(() => {
              fs.unlinkSync(filePath);
              resolve(errorFilePath);
            })
            .catch((error) => { throw new Error(error); });
        } catch (error) {
          throw new Error(error);
        }
      });

      parseStream.on('error', (error) => reject(error));
      fileStream.pipe(parseStream);
    });

  }

  /**
     * Function that list the active users using pagination by sending the number of the page.
     * If user doesn't send the page parameter by default starts in 1.
     *
     * @param {{}} query
     * @param {string} userRole
     * @returns Promise<{ users: {} }>}
     */
  async function listUsers(query, userRole) {
    try {
      const { page = 1 } = query;
      const searchQuery = queryParamsHandler(query, userRole);
      const pagination = await paginationHandler(page, store, TABLE, searchQuery);
      const users = await store.list(TABLE, searchQuery, pagination);

      return ({
        users,
        totalPages: pagination.totalPages,
        currentPage: parseInt(page, 10),
        totalDocuments: pagination.totalDocuments,
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  /**
     * Function that receives the userId and returns the user object or an empty object if user not exists in DB.
     *
     * @param {String} userId
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
     * @param {String} userId id of the user that will be modified
     * @param {{}} userData Object that includes the data that will modify the document
     * @param {{}} updatedBy Object that includes the information from the user that is doing the request
     * @returns {Promise<{ updatedId: String, updatedCount: number }>}
     */
  async function updateUser(userId, userData, updatedBy) {

    try {
      const id = objectIdHandler(userId);
      const updateUser = updateObjectHandler(userData, updatedBy);
      const base64regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;

      if (updateUser.avatar && updateUser.avatar === '') {
        if (base64regex.test(updateUser.avatar)) {
          const aws = new AWS();
          const upload = await aws.uploadAvatar(updateUser.avatar, updateUser.auth.username, updateUser.avatar.avatarMimeType);
          if (upload) {
            updateUser.avatar = upload.Location;
          }
        }
      }

      const updatedCount = await store.update(TABLE, id, updateUser);
      return updatedCount;
    } catch (error) {
      throw new Error(error);
    }
  }

  /**
     * Function that receives the userId and delete its user.
     *
     * @param {String} userId
     * @param {{}} updatedBy Object that includes the information from the user that is doing the request
     * @returns {Promise<{ deletedId: String, deletedCount: number }>}
     */
  async function deleteUser(userId, updatedBy) {

    try {
      const updatedAt = Date.now();
      const id = objectIdHandler(userId);
      const deletedCount = await store.update(TABLE, id,
        { 'auth.active': false, updatedAt, updatedBy });
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
      throw (messages.SSKB_ERROR_USER_REQUIRED);
    }
    return loginUserHandler(user, store, TABLE);
  }

  /**
     * Function that generates a new password for the user and send it a new one by email
     *
     * @param {String} userId
     * @param {{}} updatedBy Object that includes the information from the user that is doing the request
     * @returns {Promise <{ "matchedCount": number, "updatedCount": number}>} Object reset password results
     */
  async function resetPassword(userId, updatedBy) {

    try {
      const result = await store.get(TABLE, userId, { 'auth.email': 1, 'auth.username': 1, '_id': 0 });

      if (!result) {
        throw (messages.SSKB_ERROR_INVALID_USER);
      }

      const { email, username } = result.auth;

      let passwords = await createPasswordHandler();

      let { password, hashedPassword } = passwords;
      let credentials = { username, password };
      const updatedAt = Date.now();

      const id = objectIdHandler(userId);
      const updatedPassword = await store.update(TABLE, id, { 'auth.password': hashedPassword, updatedAt, updatedBy });

      if (updatedPassword.updatedCount === 0) {
        return updatedPassword;
      }

      const mailId = await sendRestPasswordEmailHandler({ email, credentials });

      if (!mailId) {
        throw (messages.SSKB_ERROR_COULDNT_SEND_MAIL);
      }

      hashedPassword = '';
      password = '';
      credentials = {};
      passwords = {};

      return updatedPassword;

    } catch (error) {
      throw new Error(error);
    }
  }

  /**
     * Function that add a medical test to user
     *
     * @param {String} userId
     * @param {{}} userData
     * @param {{}} requestBy Object that includes the information from the user that is doing the request
     * @returns Promise<{ tests: {} }>
     */
  async function addTestToUser(userId, userData, requestBy) {

    try {

      const updatedAt = Date.now();
      const id = objectIdHandler(userId);
      const updatedData = await createUserTestHandler(store, TABLE, userId, userData, requestBy);

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
     * @param {{}} updatedBy Object that includes the information from the user that is doing the request
     * @returns {Promise<{ deletedId: String, deletedCount: number }>}
     */
  async function deleteUserTest(userTestId, updatedBy) {

    try {

      const updatedAt = Date.now();

      const existsResults = await store.findAndCount(TABLE, { 'tests': { $elemMatch: { 'testId': userTestId, 'results': { $exists: true } } } });

      if (existsResults >= 1) {
        throw messages.SSKB_ERROR_HAS_RESULTS_YET;
      }
      const deletedCount = await store.update(TABLE, { 'tests.testId': userTestId },
        {
          'tests.$.status': 'INACTIVE',
          'tests.$.updatedBy': updatedBy,
          'tests.$.updatedAt': updatedAt,
        });

      return deletedCount;

    } catch (error) {
      throw new Error(error);
    }
  }

  /**
     *
     *
     * @param {String} userId
     * @param {{}} property
     * @param {{}} filter
     * @returns {Promise<{ user: {profile: {}}}>}
     */
  async function getUserProperty(userId, property, filter) {

    try {

      const queryProjection = projectionHandler(property, filter);

      const user = await store.get(TABLE, userId, queryProjection);

      if (!user) return messages.SSKB_ERROR_USER_DOESNT_EXISTS;

      return user[property] !== undefined ? { ...user } : `Property "${property}" doesn't exists in user`;
    } catch (error) {
      throw new Error(error);
    }
  }

  /**
     * Function that retrieves all tests that match with a filter. Filter can be status = ['D', 'P']
     *
     * @param {String} userId
     * @param {String} property
     * @param {{}} filter
     * @returns {Promise<{tests: {}}>}
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
     * @returns {Promise <{results: {}}>} results
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
   * @param {{}} testData
   * @param {{}} updatedBy Object that includes the information from the user that is doing the request
   * @return {Promise <{ "matchedCount": number, "updatedCount": number}>}
   */
  async function updateMedicalTest(testsId, testData, updatedBy) {
    try {
      const test = prefixHandler('tests', testData);

      const updateTest = {
        ...test,
        updatedBy,
      };
      return await store.update(TABLE, { 'tests.testId': testsId }, updateTest);
    } catch (error) {
      throw new Error(error);
    }
  }

  /**
   * Update data in MongoDB from test result
   * @param {String} userId
   * @param testId
   * @param  {{}} resultsData
   * @param {{}} updatedBy Object that includes the information from the user that is doing the request
   * @return {Promise <{ "matchedCount": number, "updatedCount": number}>}
   */
  async function upsertMedicalResultsData(userId, testId, resultsData, updatedBy) {
    const testResultsData = resultsData;
    if (Object.entries(testResultsData).length === 0) throw (messages.SSKB_ERROR_MUSTNT_BE_EMPTY);

    const id = objectIdHandler(userId);
    const operation = [{ $match: id },
      { '$project': {
        '_id': 0,
        'tests': {
          '$filter': {
            'input': '$tests',
            'as': 'tests',
            'cond': { '$eq': ['$$tests.testId', testId] },
          },
        },
      } }];

    const [result] = await store.aggregate(TABLE, operation);

    if (result.tests[0].status === 'DONE') throw new Error(messages.SSKB_ERROR_RESULTS_HAS_DONE);

    testResultsData.results.updatedBy = updatedBy;
    testResultsData.results.updatedAt = Date.now();
    const updateResults = prefixHandler('tests', testResultsData);
    return store.update(TABLE, { 'tests.testId': testId }, updateResults);
  }

  /**
     *
     * @param userId
     * @param property
     * @param testsIds
     * @return {Promise<*>}
     */
  async function getPdfResults(userId, property, testsIds) {
    try {
      const id = objectIdHandler(userId);
      const queryProjection = pdfProjectionHandler(testsIds);
      const operation = [{ $match: id }, { ...queryProjection }];
      const [result] = await store.aggregate(TABLE, operation);
      return result;
    } catch (error) {
      throw new Error(error);
    }
  }

  return {
    insertUser,
    insertUsers,
    listUsers,
    getUser,
    updateUser,
    deleteUser,
    loginUser,
    resetPassword,
    getUserProperty,
    getTests,
    addTestToUser,
    deleteUserTest,
    updateMedicalTest,
    getTestResults,
    upsertMedicalResultsData,
    getPdfResults,
  };
};
