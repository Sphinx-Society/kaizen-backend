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

const createUserAvatarSuccess = {
  'profile': {
    'firstName': 'John',
    'lastName': 'Doe',
    'birthDate': 684633600,
    'phoneNumber': '+525544335511',
    'avatar': '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',
    'avatarMimeType': 'image/png',
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

const createUserWithoutProfileError = {
  'auth': {
    'email': 'me@example.com',
    'role': 'xxx',
  },
};

module.exports = {
  createUserSuccess,
  createUserAvatarSuccess,
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
  createUserWithoutProfileError,
};
