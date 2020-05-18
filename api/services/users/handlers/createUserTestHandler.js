const { ObjectId } = require('mongodb');

/**
 * Function that validates if test can be saved in a user.
 *
 * @param {*} store
 * @param {*} TABLE
 * @param {*} userId
 * @param {*} data
 * @returns Promise<{ tests: Object; }>
 */
async function createUserTestHandler(store, TABLE, userId, data) {

  const count = await store.countDocuments(TABLE, { $and: [{ '_id': ObjectId(userId) }, { 'tests.testId': data.tests.testId }, { 'tests.status': 'PENDING' }] });

  if (count >= 1) {
    throw new Error('Medical test already exists in user');
  }

  const updatedData = { tests: { ...data.tests, 'status': 'PENDING' } };

  return updatedData;
}

module.exports = createUserTestHandler;
