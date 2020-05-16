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

module.exports = {
  updateUserSuccess,
  updateUserForbiddenPropertyError,
  updateUserInvalidPropertyError,
};
