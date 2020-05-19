const { ObjectId } = require('mongodb');
const { nanoid } = require('nanoid');

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

  const count = await store.countDocuments(TABLE, { $and: [{ '_id': ObjectId(userId) }, { 'tests.testName': data.tests.testName }, { 'tests.status': 'PENDING' }] });

  if (count >= 1) {
    throw new Error('A pending medical test already exists in user');
  }
  const updatedData = {
    tests: {
      testId: nanoid(),
      testName: data.tests.testName,
      doctorName: data.tests.doctorName,
      doctorId: data.tests.doctorId,
      status: 'PENDING',
    },
  };

  return updatedData;
}

module.exports = createUserTestHandler;
