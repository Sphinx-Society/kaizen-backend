const createUserSuccess = {
  'profile': {
    'firstName': 'John',
    'lastName': 'Doe',
    'birthDate': 684633600,
    'phoneNumber': '+525544335511',
    'avatar': '',
    'gender': 'Male',
    'country': 'MX',
    'documentId': '2222222222',
  },
  'auth': {
    'email': 'me@example.com',
    'role': 'patient',
  },
};

const createUserFirstNameError = {
  'profile': {
    'firstName': '',
    'lastName': 'Doe',
    'birthDate': 684633600,
    'phoneNumber': '+525544335511',
    'avatar': '',
    'gender': 'Male',
    'country': 'MX',
    'documentId': '1234567890',
  },
  'auth': {
    'email': 'me@example.com',
    'role': 'patient',
  },
};

const createUserLastNameError = {
  'profile': {
    'firstName': 'John',
    'lastName': '',
    'birthDate': 684633600,
    'phoneNumber': '+525544335511',
    'avatar': '',
    'gender': 'Male',
    'country': 'MX',
    'documentId': '1234567890',
  },
  'auth': {
    'email': 'me@example.com',
    'role': 'patient',
  },
};

const createUserBirthDateError = {
  'profile': {
    'firstName': 'John',
    'lastName': 'Doe',
    'birthDate': '',
    'phoneNumber': '+525544335511',
    'avatar': '',
    'gender': 'Male',
    'country': 'MX',
    'documentId': '1234567890',
  },
  'auth': {
    'email': 'me@example.com',
    'role': 'patient',
  },
};

const createUserPhoneNumberError = {
  'profile': {
    'firstName': 'John',
    'lastName': 'Doe',
    'birthDate': 0,
    'phoneNumber': '+5255443355',
    'avatar': '',
    'gender': 'Male',
    'country': 'MX',
    'documentId': '1234567890',
  },
  'auth': {
    'email': 'me@example.com',
    'role': 'patient',
  },
};

const createUserPhoneNumberNullError = {
  'profile': {
    'firstName': 'John',
    'lastName': 'Doe',
    'birthDate': 0,
    'phoneNumber': '',
    'avatar': '',
    'gender': 'Male',
    'country': 'MX',
    'documentId': '1234567890',
  },
  'auth': {
    'email': 'me@example.com',
    'role': 'patient',
  },
};

const createUserGenderError = {
  'profile': {
    'firstName': 'John',
    'lastName': 'Doe',
    'birthDate': 0,
    'phoneNumber': '+525544335511',
    'avatar': '',
    'gender': '',
    'country': 'MX',
    'documentId': '1234567890',
  },
  'auth': {
    'email': 'me@example.com',
    'role': 'patient',
  },
};

const createUserCountryError = {
  'profile': {
    'firstName': 'John',
    'lastName': 'Doe',
    'birthDate': 0,
    'phoneNumber': '+525544335511',
    'avatar': '',
    'gender': 'Male',
    'country': '',
    'documentId': '1234567890',
  },
  'auth': {
    'email': 'me@example.com',
    'role': 'patient',
  },
};

const createUserDocumentIdError = {
  'profile': {
    'firstName': 'John',
    'lastName': 'Doe',
    'birthDate': 0,
    'phoneNumber': '+525544335511',
    'avatar': '',
    'gender': 'Male',
    'country': 'MX',
    'documentId': '',
  },
  'auth': {
    'email': 'me@example.com',
    'role': 'patient',
  },
};

const createUserEmailError = {
  'profile': {
    'firstName': 'John',
    'lastName': 'Doe',
    'birthDate': 0,
    'phoneNumber': '+525544335511',
    'avatar': '',
    'gender': 'Male',
    'country': 'MX',
    'documentId': '1234567890',
  },
  'auth': {
    'email': 'me@example',
    'role': 'patient',
  },
};

const createUserRoleError = {
  'profile': {
    'firstName': 'John',
    'lastName': 'Doe',
    'birthDate': 0,
    'phoneNumber': '+525544335511',
    'avatar': '',
    'gender': 'Male',
    'country': 'MX',
    'documentId': '1234567890',
  },
  'auth': {
    'email': 'me@example.com',
    'role': 'xxx',
  },
};

module.exports = {
  createUserSuccess,
  createUserFirstNameError,
  createUserLastNameError,
  createUserBirthDateError,
  createUserPhoneNumberNullError,
  createUserPhoneNumberError,
  createUserGenderError,
  createUserCountryError,
  createUserDocumentIdError,
  createUserEmailError,
  createUserRoleError,
};
