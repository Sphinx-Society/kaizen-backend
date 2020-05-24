const express = require('express');
const response = require('../../../network/response');
const Controller = require('./index');

const {
  createTemplateSchema,
} = require('./schema');

const router = express.Router();

/**
 * Templates router that compare the request with the schema and if it's correct, it send it to the controller
 * @param  {} validation
 */
const Router = (validation) => {

  router.post('/', validation(createTemplateSchema), insertTemplate);

  function insertTemplate(req, res, next) {

    Controller.insertTemplate(req.body)
      .then((template) => {
        response.success(req, res, template, 201);
      })
      .catch(next);
  }

  return router;
};

module.exports = Router;

