const express = require('express');
const response = require('../../../network/response');
const Controller = require('./index');
const { userIdSchema, createUserSchema, listUsersSchema, updateUserSchema } = require('./schema');

const router = express.Router();

/**
 * Users router that compare the request with the schema and if it's correct, it send it to the controller
 * @param  {} validation
 */
const Router = (validation) => {

  router.post('/', validation(createUserSchema), insertUser);
  router.get('/', validation(listUsersSchema, 'query'), listUsers);
  router.get('/:userId', validation({ userId: userIdSchema }, 'params'), getUser);
  router.put('/:userId', validation({ userId: userIdSchema }, 'params'), validation(updateUserSchema), updateUser);
  router.delete('/:userId', validation({ userId: userIdSchema }, 'params'), deleteUser);
  router.post('/login', loginUser);
  router.get('/:userId/profile', validation({ userId: userIdSchema }, 'params'), getUserProfile);

  function insertUser(req, res, next) {

    Controller.insertUser(req.body)
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

    Controller.updateUser(userId, userData)
      .then((user) => {
        response.success(req, res, user, 200);
      })
      .catch(next);
  }

  function deleteUser(req, res, next) {

    const { userId } = req.params;

    Controller.deleteUser(userId)
      .then((user) => {
        response.success(req, res, user, 200);
      })
      .catch(next);
  }

  function loginUser(req, res, next) {
    Controller.loginUser(req.body)
      .then((data) => {
        response.success(req, res, data, 200);
      })
      .catch(next);
  }

  function getUserProfile(req, res, next) {

    const { userId } = req.params;

    Controller.getUserProperty(userId, 'profile')
      .then((user) => {
        response.success(req, res, user, 200);
      })
      .catch(next);
  }

  return router;
};

module.exports = Router;

