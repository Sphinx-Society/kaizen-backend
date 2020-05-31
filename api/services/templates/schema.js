const Joi = require('@hapi/joi');

const templateIdSchema = Joi.string().regex(/^[0-9a-fA-F]{24}$/);

const createTemplateFieldSchema =
  Joi.object().keys({
    'id': Joi.string().label('Field id').max(100).required(),
    'name': Joi.string().label('Field name').max(100).required(),
    'type': Joi.string().label('Field type').valid('string', 'number', 'select', 'text').required(),
    'minLimit': Joi.number().label('Field minimum limit').precision(2),
    'maxLimit': Joi.number().label('Field maximum limit').precision(2),
    'unit': Joi.string().label('Field unit').max(100).allow(''),
    'options': Joi.array().label('Field options'),
    'required': Joi.boolean().label('Field required').default(false),
  }).required();

const createTemplateSchema = {
  'name': Joi.string().label('Template name').max(100).required(),
  'type': Joi.string().label('Template type').max(100).required(),
  'fields': Joi.array().items(createTemplateFieldSchema).required(),
};

const updateTemplateFieldSchema =
  Joi.object().keys({
    'id': Joi.string().label('Field id').max(100),
    'name': Joi.string().label('Field name').max(100),
    'type': Joi.string().label('Field type').valid('string', 'number', 'select', 'text', 'file'),
    'minLimit': Joi.number().label('Field minimum limit').precision(2),
    'maxLimit': Joi.number().label('Field maximum limit').precision(2),
    'unit': Joi.string().label('Field unit').max(100).allow(''),
    'options': Joi.array().label('Field options'),
    'required': Joi.boolean().label('Field required').default(false),
  });

const updateTemplateSchema = {
  'name': Joi.string().label('Template name').max(100),
  'type': Joi.string().label('Template type').max(100),
  'fields': Joi.array().items(updateTemplateFieldSchema),
};

const listTemplatesSchema = {
  'page': Joi.number().min(1).allow(''),
  'q': Joi.string().label('query').allow(''),
};

module.exports = {
  templateIdSchema,
  createTemplateSchema,
  updateTemplateSchema,
  listTemplatesSchema,
};

