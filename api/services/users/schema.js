const Joi = require('@hapi/joi');

const userIdSchema = Joi.string().regex(/^[0-9a-fA-F]{24}$/);
const testIdSchema = Joi.string().regex(/^[0-9a-zA-Z_/-]{21}$/);

const createAuthUserSchema = {
  auth: Joi.object({
    email: Joi.string().email({ minDomainSegments: 2, tlds: false }).required(),
    role: Joi.string().max(50).example('Patient, Doctor, Laboratory, Admin').required(),
    isConfirmed: Joi.boolean().default(false),
    active: Joi.boolean().default(true),
  }),
};

const createUserSchema = {
  profile: Joi.object().keys({
    firstName: Joi.string().label('First Name').max(100).required(),
    lastName: Joi.string().label('Last Name').max(100).required(),
    birthDate: Joi.date().timestamp('unix').label('Birthday').required(),
    phoneNumber: Joi.string().label('Phone number').min(13).max(13)
      .required(),
    avatar: Joi.string().label('Profile picture').default('').allow(''),
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
  }),
  auth: Joi.object({
    email: Joi.string().label('Email').email({ minDomainSegments: 2, tlds: false }),
  }),
};

const listUsersSchema = {
  page: Joi.number().min(1).allow(''),
  role: Joi.string().label('Role').valid('P', 'D', 'L', 'A').allow(''),
  documentId: Joi.string().min(4).label('Document ID').allow(''),
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
    doctorId: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
    doctorName: Joi.string().label('Doctor Name').max(100),
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
};

