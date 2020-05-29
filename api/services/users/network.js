const express = require('express');
const generatorDocument = require('../../../lib/PDF/generator');
const response = require('../../../network/response');
const Controller = require('./index');
const jwtAuthMiddleware = require('../../../middleware/jwtMiddleware');
const scopeValidationMiddleware = require('../../../middleware/scopeValidationMiddleware');
const updatedByHelper = require('../../../utils/helpers/updatedByHelper');
const {
  userIdSchema,
  createUserSchema,
  listUsersSchema,
  updateUserSchema,
  updateUserProfileSchema,
  createUserTestSchema,
  testIdSchema,
  testsIdsSchema,
} = require('./schema');

const router = express.Router();

/**
 * Users router that compare the request with the schema and if it's correct, it send it to the controller
 * @param  {} validation
 */
const Router = (validation) => {

  /* CRUD OPERATIONS */
  router.post('/', validation(createUserSchema), jwtAuthMiddleware, scopeValidationMiddleware(['create:user']), insertUser);
  router.get('/', validation(listUsersSchema, 'query'), jwtAuthMiddleware, scopeValidationMiddleware(['read:listUsers']), listUsers);
  router.get('/:userId', validation({ userId: userIdSchema }, 'params'), jwtAuthMiddleware, scopeValidationMiddleware(['read:getUserById']), getUser);
  router.put('/:userId', validation({ userId: userIdSchema }, 'params'), validation(updateUserSchema), jwtAuthMiddleware, scopeValidationMiddleware(['update:updateUserById']), updateUser);
  router.delete('/:userId', validation({ userId: userIdSchema }, 'params'), jwtAuthMiddleware, scopeValidationMiddleware(['delete:deleteUserById']), deleteUser);

  /* AUTH OPERATIONS */
  router.post('/login', loginUser);
  router.put('/resetPassword/:userId', validation({ userId: userIdSchema }, 'params'), jwtAuthMiddleware, scopeValidationMiddleware(['update:password']), resetPassword);

  /* PROFILE OPERATIONS */
  router.get('/:userId/profile', validation({ userId: userIdSchema }, 'params'), jwtAuthMiddleware, scopeValidationMiddleware(['read:profile']), getUserProfile);
  router.put('/:userId/profile', validation({ userId: userIdSchema }, 'params'), validation(updateUserProfileSchema), jwtAuthMiddleware, scopeValidationMiddleware(['update:profile']), updateUserProfile);

  /* MEDICAL TESTS OPERATIONS */
  router.post('/:userId/tests', validation({ userId: userIdSchema }, 'params'), validation(createUserTestSchema), jwtAuthMiddleware, scopeValidationMiddleware(['create:test']), insertUserTest);
  router.get('/:userId/tests', validation({ userId: userIdSchema }, 'params'), jwtAuthMiddleware, scopeValidationMiddleware(['read:test']), getUserTests);
  router.get('/:userId/tests/:testId', validation({ userId: userIdSchema, testId: testIdSchema }, 'params'), jwtAuthMiddleware, scopeValidationMiddleware(['read:testById']), getUserTest);
  router.put('/:userId/tests/:testId', validation({ userId: userIdSchema, testId: testIdSchema }, 'params'), jwtAuthMiddleware, scopeValidationMiddleware(['update:testById']), updateMedicalTest);
  router.delete('/:userId/tests/:testId', validation({ userId: userIdSchema, testId: testIdSchema }, 'params'), jwtAuthMiddleware, scopeValidationMiddleware(['delete:testById']), deleteUserTest);

  /* TEST RESULTS OPERATIONS */
  router.get('/:userId/tests/:testId/results', validation({ userId: userIdSchema, testId: testIdSchema }, 'params'), jwtAuthMiddleware, scopeValidationMiddleware(['read:results']), getMedicalResults);
  router.post('/:userId/tests/results/document', validation({ userId: userIdSchema }, 'params'), validation({ testsIds: testsIdsSchema }, 'body'), getResultsPdf);
  router.put('/:userId/tests/:testId/results', validation({ userId: userIdSchema, testId: testIdSchema }, 'params'), jwtAuthMiddleware, scopeValidationMiddleware(['update:results']), upsertMedicalResults);

  /* CRUD OPERATIONS */
  function insertUser(req, res, next) {

    const createdBy = updatedByHelper(req.payload);
    Controller.insertUser(req.body, createdBy)
      .then((user) => {
        response.success(req, res, user, 201);
      })
      .catch(next);
  }

  function listUsers(req, res, next) {
    Controller.listUsers(req.query)
      .then((user) => {
        response.success(req, res, user, 200);
      })
      .catch(next);
  }

  function getUser(req, res, next) {
    const { userId } = req.params;
    Controller.getUser(userId)
      .then((user) => {
        response.success(req, res, user, 200);
      })
      .catch(next);
  }

  function updateUser(req, res, next) {

    const { userId } = req.params;
    const userData = req.body;
    const updatedBy = updatedByHelper(req.payload);
    Controller.updateUser(userId, userData, updatedBy)
      .then((user) => {
        response.success(req, res, user, 200);
      })
      .catch(next);
  }

  function deleteUser(req, res, next) {
    const { userId } = req.params;
    const deletedBy = updatedByHelper(req.payload);
    Controller.deleteUser(userId, deletedBy)
      .then((user) => {
        response.success(req, res, user, 200);
      })
      .catch(next);
  }

  /* AUTH OPERATIONS */
  function loginUser(req, res, next) {
    Controller.loginUser(req.body)
      .then((data) => {
        response.success(req, res, data, 200);
      })
      .catch(next);
  }

  function resetPassword(req, res, next) {
    const { userId } = req.params;
    const updatedBy = updatedByHelper(req.payload);
    Controller.resetPassword(userId, updatedBy)
      .then((data) => {
        response.success(req, res, data, 200);
      })
      .catch(next);
  }

  /* PROFILE OPERATIONS */
  function getUserProfile(req, res, next) {
    const { userId } = req.params;
    Controller.getUserProperty(userId, 'profile')
      .then((user) => {
        response.success(req, res, user, 200);
      })
      .catch(next);
  }

  function updateUserProfile(req, res, next) {
    const { userId } = req.params;
    const userData = req.body;
    const updatedBy = updatedByHelper(req.payload);
    Controller.updateUser(userId, userData, updatedBy)
      .then((user) => {
        response.success(req, res, user, 200);
      })
      .catch(next);
  }

  /* MEDICAL TESTS OPERATIONS */
  function insertUserTest(req, res, next) {
    const { userId } = req.params;
    const userData = req.body;
    const requestBy = updatedByHelper(req.payload);
    Controller.addTestToUser(userId, userData, requestBy)
      .then((user) => {
        response.success(req, res, user, 200);
      })
      .catch(next);
  }

  function getUserTest(req, res, next) {
    const { userId } = req.params;
    Controller.getUserProperty(userId, 'tests', req.params)
      .then((user) => {
        response.success(req, res, user, 200);
      })
      .catch(next);
  }

  function getUserTests(req, res, next) {
    const { userId } = req.params;
    Controller.getTests(userId, 'tests', req.query)
      .then((user) => {
        response.success(req, res, user, 200);
      })
      .catch(next);
  }

  function deleteUserTest(req, res, next) {
    const { testId } = req.params;
    const updatedBy = updatedByHelper(req.payload);
    Controller.deleteUserTest(testId, updatedBy)
      .then((user) => {
        response.success(req, res, user, 200);
      })
      .catch(next);
  }

  function updateMedicalTest(req, res, next) {
    const { testId } = req.params;
    const testData = req.body;
    const updatedBy = updatedByHelper(req.payload);
    Controller.updateMedicalTest(testId, testData, updatedBy)
      .then((user) => {
        response.success(req, res, user, 200);
      })
      .catch(next);
  }

  /* TEST RESULTS OPERATIONS */
  function getMedicalResults(req, res, next) {
    const { userId, testId } = req.params;
    Controller.getTestResults(userId, testId)
      .then((user) => {
        response.success(req, res, user, 200);
      })
      .catch(next);
  }

  function upsertMedicalResults(req, res, next) {
    const { testId } = req.params;
    const testResultsData = req.body;
    const updatedBy = updatedByHelper(req.payload);
    Controller.upsertMedicalResultsData(testId, testResultsData, updatedBy)
      .then((user) => {
        response.success(req, res, user, 200);
      })
      .catch(next);
  }

  /* MISCELLANEOUS */
  function getResultsPdf(req, res, next) {
    const { testsIds } = req.body;
    const { userId } = req.params;

    if (testsIds.length === 0) throw new Error('testIds property can\'t be empty');

    Controller.getPdfResults(userId, 'tests', testsIds)
      .then(async (result) => {
        const pdf = await generatorDocument(result.tests);
        res.contentType('application/pdf');
        res.send(pdf);
      })
      .catch(next);
  }

  return router;
};

module.exports = Router;

