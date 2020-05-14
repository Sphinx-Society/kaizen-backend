const Joi = require('@hapi/joi');

const createUserProfileSchema = {
  profile: Joi.object({
    name: Joi.string().label('First Name').max(100).required(),
    lastName: Joi.string().label('Last Name').max(100).required(),
    birthday: Joi.date().timestamp('unix').label('Birthday').required(),
    phoneNumber: Joi.string().label('Phone number').max(13).required(),
    avatar: Joi.string().label('Profile picture'),
    gender: Joi.string().max(50).label('Gender').required(),
    country: Joi.string().max(50).label('Country').required(),
    documentId: Joi.string().label('Document ID').example('INE in Mexico, tarjeta de identidad in Colombia').required(),
  }),
};

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

const listUsersSchema = {
  page: Joi.number().min(1).required(),
};

module.exports = {
  createUserSchema,
  listUsersSchema,
};

