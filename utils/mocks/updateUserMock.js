const updateUserSuccess = {
  'profile': {
    'firstName': 'Johana',
    'lastName': 'Doe',
    'birthDate': 0,
    'phoneNumber': '+523344556677',
    'avatar': '',
    'gender': 'Male',
    'country': 'MX',
  },
  'auth': {
    'email': 'ary.rosvall@gmail.com',
  },
};

const updateUserForbiddenPropertyError = {
  'profile': {
    'firstName': 'Johana',
    'lastName': 'Doe',
    'birthDate': 0,
    'phoneNumber': '+523344556677',
    'avatar': '',
    'gender': 'Male',
    'country': 'MX',
  },
  'auth': {
    'email': 'ary.rosvall@gmail.com',
    'role': 'admin',
  },
};

const updateUserInvalidPropertyError = {
  'profile': {
    'firstName': 'Johana',
    'lastName': 'Doe',
    'birthDate': 0,
    'phoneNumber': '+5233445566',
    'avatar': '',
    'gender': 'Male',
    'country': 'MX',
  },
  'auth': {
    'email': 'ary.rosvall@gmail.com',
    'role': 'admin',
  },
};

const updateUserProfileSuccess = {
  'profile': {
    'firstName': 'John',
    'lastName': 'Doe',
    'birthDate': 0,
    'phoneNumber': '+523344556677',
    'avatar': '',
    'gender': 'Male',
    'country': 'MX',
  },
};

const updateUserProfileInvalidPropertyError = {
  'profile': {
    'firstName': 'Johana',
    'lastName': 'Doe',
    'birthDate': 0,
    'phoneNumber': '+5233445566',
    'avatar': '',
    'gender': 'Male',
    'country': 'MX',
  },
};

const createUserTestSuccess = {
  'tests':
  {
    'testName': 'Prueba de sangre',
    'doctorId': '000000000000000000000001',
    'doctorName': 'JUAN PEREZ RODRIGUEZ',
  },
};

module.exports = {
  updateUserSuccess,
  updateUserForbiddenPropertyError,
  updateUserInvalidPropertyError,
  updateUserProfileSuccess,
  updateUserProfileInvalidPropertyError,
  createUserTestSuccess,
};
