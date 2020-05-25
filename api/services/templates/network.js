const express = require('express');
const response = require('../../../network/response');
const Controller = require('./index');

const {
  createTemplateSchema,
  updateTemplateSchema,
  templateIdSchema,
} = require('./schema');

const router = express.Router();

/**
 * Templates router that compare the request with the schema and if it's correct, it send it to the controller
 * @param  {} validation
 */
const Router = (validation) => {

  /* CRUD OPERATIONS */
  router.post('/', validation(createTemplateSchema), insertTemplate);
  router.get('/:templateId', validation({ templateId: templateIdSchema }, 'params'), getTemplate);
  router.put('/:templateId', validation({ templateId: templateIdSchema }, 'params'), validation(updateTemplateSchema), updateTemplate);

  function insertTemplate(req, res, next) {

    Controller.insertTemplate(req.body)
      .then((template) => {
        response.success(req, res, template, 201);
      })
      .catch(next);
  }

  function updateTemplate(req, res, next) {

    const { templateId } = req.params;
    const templateData = req.body;
    Controller.updateTemplate(templateId, templateData)
      .then((template) => {
        response.success(req, res, template, 200);
      })
      .catch(next);
  }

  function getTemplate(req, res, next) {
    const { templateId } = req.params;
    Controller.getTemplateById(templateId)
      .then((template) => {
        response.success(req, res, template, 200);
      })
      .catch(next);
  }

  return router;
};

module.exports = Router;

