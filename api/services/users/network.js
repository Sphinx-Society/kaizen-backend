const express = require('express');
const multer = require('multer');
const generatorDocument = require('../../../lib/PDF/generator');
const response = require('../../../network/response');
const Controller = require('./index');
const jwtAuthMiddleware = require('../../../middleware/jwtMiddleware');
const scopeValidationMiddleware = require('../../../middleware/scopeValidationMiddleware');
const updatedByHelper = require('../../../utils/helpers/updatedByHelper');
const webpush = require('../../../lib/Notifications');

const upload = multer({ dest: 'tmp/' });
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
  router.post('/', jwtAuthMiddleware, scopeValidationMiddleware(['create:user']), validation(createUserSchema), insertUser);
  router.post('/massive', jwtAuthMiddleware, scopeValidationMiddleware(['create:user']), upload.single('users'), insertUsers);
  router.get('/', jwtAuthMiddleware, scopeValidationMiddleware(['read:listUsers']), validation(listUsersSchema, 'query'), listUsers);
  router.get('/:userId', jwtAuthMiddleware, scopeValidationMiddleware(['read:getUserById']), validation({ userId: userIdSchema }, 'params'), getUser);
  router.put('/:userId', jwtAuthMiddleware, scopeValidationMiddleware(['update:updateUserById']), validation({ userId: userIdSchema }, 'params'), validation(updateUserSchema), updateUser);
  router.delete('/:userId', jwtAuthMiddleware, scopeValidationMiddleware(['delete:deleteUserById']), validation({ userId: userIdSchema }, 'params'), deleteUser);

  /* AUTH OPERATIONS */
  router.post('/login', loginUser);
  router.put('/resetPassword/:userId', jwtAuthMiddleware, scopeValidationMiddleware(['update:password']), validation({ userId: userIdSchema }, 'params'), resetPassword);

  /* PROFILE OPERATIONS */
  router.get('/:userId/profile', jwtAuthMiddleware, scopeValidationMiddleware(['read:profile']), validation({ userId: userIdSchema }, 'params'), getUserProfile);
  router.put('/:userId/profile', jwtAuthMiddleware, scopeValidationMiddleware(['update:profile']), validation({ userId: userIdSchema }, 'params'), validation(updateUserProfileSchema), updateUserProfile);

  /* MEDICAL TESTS OPERATIONS */
  router.post('/:userId/tests', jwtAuthMiddleware, scopeValidationMiddleware(['create:test']), validation({ userId: userIdSchema }, 'params'), validation(createUserTestSchema), insertUserTest);
  router.get('/:userId/tests', jwtAuthMiddleware, scopeValidationMiddleware(['read:tests']), validation({ userId: userIdSchema }, 'params'), getUserTests);
  router.get('/:userId/tests/:testId', jwtAuthMiddleware, scopeValidationMiddleware(['read:testById']), validation({ userId: userIdSchema, testId: testIdSchema }, 'params'), getUserTest);
  router.put('/:userId/tests/:testId', jwtAuthMiddleware, scopeValidationMiddleware(['update:testById']), validation({ userId: userIdSchema, testId: testIdSchema }, 'params'), updateMedicalTest);
  router.delete('/:userId/tests/:testId', jwtAuthMiddleware, scopeValidationMiddleware(['delete:testById']), validation({ userId: userIdSchema, testId: testIdSchema }, 'params'), deleteUserTest);

  /* TEST RESULTS OPERATIONS */
  router.get('/:userId/tests/:testId/results', jwtAuthMiddleware, scopeValidationMiddleware(['read:results']), validation({ userId: userIdSchema, testId: testIdSchema }, 'params'), getMedicalResults);
  router.post('/:userId/tests/results/document', jwtAuthMiddleware, scopeValidationMiddleware(['read:resultsDocuments']), validation({ userId: userIdSchema }, validation({ testsIds: testsIdsSchema }), 'body'), getResultsPdf);
  router.put('/:userId/tests/:testId/results', jwtAuthMiddleware, scopeValidationMiddleware(['update:results']), validation({ userId: userIdSchema, testId: testIdSchema }, 'params'), upsertMedicalResults);

  /* MISCELLANEOUS */
  router.post('/subscribe', subscribeNotification);

  /* CRUD OPERATIONS */
  function insertUser(req, res, next) {

    const createdBy = updatedByHelper(req.payload);
    Controller.insertUser(req.body, createdBy)
      .then((user) => {
        response.success(req, res, user, 201);
      })
      .catch(next);
  }

  function insertUsers(req, res, next) {

    const createdBy = updatedByHelper(req.payload);
    Controller.insertUsers(req.file, createdBy)
      .then(async (file) => {
        await res.download(file);
      })
      .catch(next);
  }

  function listUsers(req, res, next) {
    const { role } = req.payload;
    Controller.listUsers(req.query, role)
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

    if (testsIds.length === 0) throw new Error(messages.SSKB_ERROR_PROPERTY_TESTSIDS);

    Controller.getPdfResults(userId, 'tests', testsIds)
      .then(async (result) => {
        const pdf = await generatorDocument(result);
        res.contentType('application/pdf');
        res.send(pdf);
      })
      .catch(next);
  }

  async function subscribeNotification(req, res, send) {
    res.status(200).json();
    const payload = JSON.stringify({
      title: 'Kaizen Notification',
      message: 'Welcome',
    });

    try {
      await webpush.sendNotification(req.body, payload);
    } catch (error) {
      throw new Error(error);
    }
  }

  return router;
};

module.exports = Router;

