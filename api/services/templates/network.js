const express = require('express');
const response = require('../../../network/response');
const Controller = require('./index');
const jwtAuthMiddleware = require('../../../middleware/jwtMiddleware');
const scopeValidationMiddleware = require('../../../middleware/scopeValidationMiddleware');

const {
  createTemplateSchema,
  updateTemplateSchema,
  templateIdSchema,
  listTemplatesSchema,
} = require('./schema');

const router = express.Router();

/**
 * Templates router that compare the request with the schema and if it's correct, it send it to the controller
 * @param  {} validation
 */
const Router = (validation) => {

  /* CRUD OPERATIONS */
  router.post('/', validation(createTemplateSchema), insertTemplate);
  router.get('/', validation(listTemplatesSchema, 'query'), listTemplates);
  router.get('/:templateId', validation({ templateId: templateIdSchema }, 'params'), getTemplate);
  router.put('/:templateId', validation({ templateId: templateIdSchema }, 'params'), validation(updateTemplateSchema), updateTemplate);
  router.delete('/:templateId', validation({ templateId: templateIdSchema }, 'params'), deleteTemplate);

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

  function deleteTemplate(req, res, next) {

    const { templateId } = req.params;
    Controller.deleteTemplate(templateId)
      .then((template) => {
        response.success(req, res, template, 200);
      })
      .catch(next);
  }

  function listTemplates(req, res, next) {
    Controller.listTemplates(req.query)
      .then((user) => {
        response.success(req, res, user, 200);
      })
      .catch(next);
  }

  return router;
};

module.exports = Router;

