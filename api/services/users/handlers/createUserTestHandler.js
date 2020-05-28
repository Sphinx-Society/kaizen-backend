const { nanoid } = require('nanoid');
const objectIdHandler = require('../../shared/handlers/objectIdHandler');

/**
 * Function that validates if test can be saved in a user.
 *
 * @param {*} store
 * @param {*} TABLE
 * @param {*} userId
 * @param {*} data
 * @returns Promise<{ tests: Object; }>
 */
async function createUserTestHandler(store, TABLE, userId, data, requestBy) {

  id = objectIdHandler(userId);

  const isPatient = await store.countDocuments(TABLE, { $and: [id, { 'auth.role': 'patient' }] });

  if (isPatient !== 1) {
    throw new Error('This user is not a patient');
  }
  const count = await store.countDocuments(TABLE, { $and: [id, { 'tests.testName': data.tests.testName }, { 'tests.status': 'PENDING' }] });

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
      requestBy,
      requestedAt: Date.now(),
    },
  };

  return updatedData;
}

module.exports = createUserTestHandler;
