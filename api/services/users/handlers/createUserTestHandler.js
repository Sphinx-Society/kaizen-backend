const { nanoid } = require('nanoid');
const objectIdHandler = require('../../shared/handlers/objectIdHandler');
const messages = require('../../../../config/messages');
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
    throw (messages.SSKB_ERROR_USER_NOT_BE_A_PATIENT);
  }
  const count = await store.countDocuments(TABLE, { $and: [id, { 'tests.testName': data.tests.testName }, { 'tests.status': 'PENDING' }] });

  if (count >= 1) {
    throw (messages.SSKB_ERROR_PENDING_TEST);
  }
  const updatedData = {
    tests: {
      testId: nanoid(),
      testName: data.tests.testName,
      templateId: data.tests.templateId,
      status: 'PENDING',
      requestBy,
      requestedAt: Date.now(),
    },
  };

  return updatedData;
}

module.exports = createUserTestHandler;
