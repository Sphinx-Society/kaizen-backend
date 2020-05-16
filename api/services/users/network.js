const express = require('express');
const response = require('../../../network/response');
const Controller = require('./index');
const { createUserSchema, listUsersSchema } = require('./schema');

const router = express.Router();

/**
 * users router that compare the request with the schema and if it's correct, it send it to the controller
 * @param  {} validation
 */
const Router = (validation) => {

  router.post('/', validation(createUserSchema), insertUser);
  router.get('/', validation(listUsersSchema, 'query'), listUsers);

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

  return router;
};

module.exports = Router;

