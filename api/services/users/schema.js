const Joi = require('@hapi/joi');
const { updateTemplateFieldSchema } = require('../templates/schema');

const userIdSchema = Joi.string().regex(/^[0-9a-fA-F]{24}$/);
const testIdSchema = Joi.string().regex(/^[0-9a-zA-Z_/-]{21}$/);

const createUserSchema = {
  profile: Joi.object().keys({
    firstName: Joi.string().label('First Name').max(100).required(),
    lastName: Joi.string().label('Last Name').max(100).required(),
    birthDate: Joi.date().timestamp('unix').label('Birthday').required(),
    phoneNumber: Joi.string().label('Phone number').min(13).max(13)
      .required(),
    avatar: Joi.string().label('Profile picture').default('').allow(''),
    avatarMimeType: Joi.string().label('MimeType from avatar').default('').allow(''),
    gender: Joi.string().max(50).label('Gender').required(),
    country: Joi.string().max(50).label('Country').required(),
    documentId: Joi.string().min(4).label('Document ID').required(),
  }),
  auth: Joi.object({
    email: Joi.string().label('Email').email({ minDomainSegments: 2, tlds: false }).required(),
    role: Joi.string().max(50).label('Role').valid('patient', 'doctor', 'lab', 'admin')
      .required(),
  }),
};

const updateUserSchema = {
  profile: Joi.object().keys({
    firstName: Joi.string().label('First Name').max(100),
    lastName: Joi.string().label('Last Name').max(100),
    birthDate: Joi.date().timestamp('unix').label('Birthday'),
    phoneNumber: Joi.string().label('Phone number').min(13).max(13),
    avatar: Joi.string().label('Profile picture').default('').allow(''),
    gender: Joi.string().max(50).label('Gender'),
    country: Joi.string().max(50).label('Country'),
    documentId: Joi.string().min(4).label('Document ID').allow(''),
  }),
  auth: Joi.object({
    email: Joi.string().label('Email').email({ minDomainSegments: 2, tlds: false }),
  }),
};

const listUsersSchema = {
  page: Joi.number().min(1).allow(''),
  role: Joi.string().label('Role').valid('P', 'D', 'L', 'A').allow(''),
  q: Joi.string().label('Query').allow(''),
};

const updateUserProfileSchema = {
  profile: Joi.object().keys({
    firstName: Joi.string().label('First Name').max(100),
    lastName: Joi.string().label('Last Name').max(100),
    birthDate: Joi.date().timestamp('unix').label('Birthday'),
    phoneNumber: Joi.string().label('Phone number').min(13).max(13),
    avatar: Joi.string().label('Profile picture').default('').allow(''),
    gender: Joi.string().max(50).label('Gender'),
    country: Joi.string().max(50).label('Country'),
  }),
};

const createUserTestSchema = {
  tests: Joi.object({
    testName: Joi.string().label('Test Name').max(100),
    templateId: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
  }),
  subscribe: Joi.object().keys({
    endpoint: Joi.string(),
    expirationTime: Joi.any(),
    keys: Joi.object({
      p256dh: Joi.string(),
      auth: Joi.string(),
    }),
  }),
};

const testsIdsSchema = Joi.array().required();

const updateTemplateItemsSchema = Joi.object().keys({
  'name': Joi.string().label('Field name').max(100),
  'value': Joi.string().label('Field name').max(100),
  'min': Joi.number().label('Field minimum limit').precision(2),
  'max': Joi.number().label('Field maximum limit').precision(2),
  'unit': Joi.string().label('Field unit').max(100).allow(''),
});

const updateTestResultsSchema = {
  results: Joi.array().items(updateTemplateItemsSchema).required(),
  status: Joi.string().label('Status'),
  subscribe: Joi.object().keys({
    endpoint: Joi.string(),
    expirationTime: Joi.any(),
    keys: Joi.object({
      p256dh: Joi.string(),
      auth: Joi.string(),
    }),
  }),
};

module.exports = {
  userIdSchema,
  createUserSchema,
  listUsersSchema,
  updateUserSchema,
  updateUserProfileSchema,
  createUserTestSchema,
  testIdSchema,
  testsIdsSchema,
  updateTestResultsSchema,
};

