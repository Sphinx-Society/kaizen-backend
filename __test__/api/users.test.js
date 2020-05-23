const supertest = require('supertest');
const app = require('../../server');
const config = require('../../config');
const MongoLib = require('../../store/mongo');
const {
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
} = require('../../utils/mocks/createUserMock');

const {
  updateUserSuccess,
  updateUserForbiddenPropertyError,
  updateUserInvalidPropertyError,
  updateUserProfileSuccess,
  updateUserProfileInvalidPropertyError,
  createUserTestSuccess,
} = require('../../utils/mocks/updateUserMock');

const { userLoginMock, userLoginFailMock } = require('../../utils/mocks/userLoginMock');

const store = new MongoLib();

describe('Testing the GET [base] API route', () => {

  it('Should test the API base route against its content and status', async (done) => {

    const response = await supertest(app).get('/');

    const base = {
      'api': 'Kaizen Backend',
      'version': '1.0.0',
      'git version': '',
    };
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject(base);

    await app.close();
    await done();

  });

  it('Should test an invalid route and return an error message', async (done) => {

    const response = await supertest(app).get('/myRoute');

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Not Found');
    expect(response.body.message).toBe('Not Found');

    await app.close();
    await done();

  });
});

describe('Testing the POST [users] endpoint', () => {

  it('Should test the post users endpoint and return a success message then delete it with delete user endpoint', async (done) => {

    const response = await supertest(app).post(`/api/${config.api.version}/users`).send(createUserSuccess);

    expect(response.error).toBe(false);
    expect(response.status).toBe(201);
    expect(response.body.message.insertedId).toHaveLength(24);
    expect(response.body.message.insertedCount).toBe(1);

    const deletedResponse = await supertest(app).delete(`/api/${config.api.version}/users/${response.body.message.insertedId}`);

    expect(deletedResponse.error).toBe(false);
    expect(deletedResponse.status).toBe(200);
    expect(deletedResponse.body.message.deletedId).toHaveLength(24);
    expect(deletedResponse.body.message.deletedCount).toBe(1);

    await app.close();
    await done();

  });

  it('Should test the post users endpoint with a First Name error and return an error message', async (done) => {

    const response = await supertest(app).post(`/api/${config.api.version}/users`).send(createUserFirstNameError);

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Bad Request');
    expect(response.body.message).toBe('\"First Name\" is not allowed to be empty');

    await app.close();
    await done();

  });

  it('Should test the post users endpoint with a Last Name error and returns an error message', async (done) => {

    const response = await supertest(app).post(`/api/${config.api.version}/users`).send(createUserLastNameError);

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Bad Request');
    expect(response.body.message).toBe('\"Last Name\" is not allowed to be empty');

    await app.close();
    await done();

  });

  it('Should test the post users endpoint with a Birth Date error and returns an error message', async (done) => {

    const response = await supertest(app).post(`/api/${config.api.version}/users`).send(createUserBirthDateError);

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Bad Request');
    expect(response.body.message).toBe('\"Birthday\" must be in timestamp or number of seconds format');

    await app.close();
    await done();

  });

  it('Should test the post users endpoint with a Phone Number format error and returns an error message', async (done) => {

    const response = await supertest(app).post(`/api/${config.api.version}/users`).send(createUserPhoneNumberError);

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Bad Request');
    expect(response.body.message).toBe('\"Phone number\" length must be at least 13 characters long');

    await app.close();
    await done();

  });

  it('Should test the post users endpoint with a Phone Number null error and returns an error message', async (done) => {

    const response = await supertest(app).post(`/api/${config.api.version}/users`).send(createUserPhoneNumberNullError);

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Bad Request');
    expect(response.body.message).toBe('\"Phone number\" is not allowed to be empty');

    await app.close();
    await done();

  });

  it('Should test the post users endpoint with a gender error and returns an error message', async (done) => {

    const response = await supertest(app).post(`/api/${config.api.version}/users`).send(createUserGenderError);

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Bad Request');
    expect(response.body.message).toBe('\"Gender\" is not allowed to be empty');

    await app.close();
    await done();

  });

  it('Should test the post users endpoint with a gender error and returns an error message', async (done) => {

    const response = await supertest(app).post(`/api/${config.api.version}/users`).send(createUserCountryError);

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Bad Request');
    expect(response.body.message).toBe('\"Country\" is not allowed to be empty');

    await app.close();
    await done();

  });

  it('Should test the post users endpoint with a gender error and returns an error message', async (done) => {

    const response = await supertest(app).post(`/api/${config.api.version}/users`).send(createUserDocumentIdError);

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Bad Request');
    expect(response.body.message).toBe('\"Document ID\" is not allowed to be empty');

    await app.close();
    await done();

  });
  it('Should test the post users endpoint with a email format error and returns an error message', async (done) => {

    const response = await supertest(app).post(`/api/${config.api.version}/users`).send(createUserEmailError);

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Bad Request');
    expect(response.body.message).toBe('\"Email\" must be a valid email');

    await app.close();
    await done();

  });

  it('Should test the post users endpoint with a Role error and returns an error message', async (done) => {

    const response = await supertest(app).post(`/api/${config.api.version}/users`).send(createUserRoleError);

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Bad Request');
    expect(response.body.message).toBe('\"Role\" must be one of [patient, doctor, lab, admin]');

    await app.close();
    await done();

  });
});

describe('Testing the GET [users] endpoint', () => {

  it('Should test the get users endpoint and return a success message', async (done) => {

    const response = await supertest(app).get(`/api/${config.api.version}/users`);

    expect(response.status).toBe(200);
    expect(response.error).toBe(false);

    await app.close();
    await done();

  });

  it('Should test the get users endpoint with documentId parameter existing in DB and return a success message', async (done) => {

    const documentId = '1234567890';
    const response = await supertest(app).get(`/api/${config.api.version}/users?documentId=${documentId}`);

    expect(response.status).toBe(200);
    expect(response.error).toBe(false);

    expect(response.body.message.users[0]).toHaveProperty(['profile', 'documentId'], documentId || {});

    await app.close();
    await done();

  });

  it('Should test the get users endpoint with documentId parameter non-existent in DB and return a success message', async (done) => {

    const documentId = '12234556778';
    const response = await supertest(app).get(`/api/${config.api.version}/users?documentId=${documentId}`);

    expect(response.status).toBe(200);
    expect(response.error).toBe(false);
    expect(response.body.message.users).toEqual([]);

    await app.close();
    await done();

  });

  const role = [
    ['A', 'admin'],
    ['L', 'lab'],
    ['P', 'patient'],
    ['D', 'doctor'],
  ];

  test.each(role)(
    'Should test the get users endpoint with a valid role parameter ("%s" = %s) and return a success message',
    async (input, output) => {

      const response = await supertest(app).get(`/api/${config.api.version}/users?role=${input}`);

      expect(response.status).toBe(200);
      expect(response.error).toBe(false);
      expect(response.body.message.users[0]).toHaveProperty(['auth', 'role'], output);
      await app.close();

    },
  );

  it('Should test the get users endpoint with invalid role parameter and return an error message', async (done) => {

    const response = await supertest(app).get(`/api/${config.api.version}/users?role=xyz`);

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Bad Request');
    expect(response.body.message).toBe('\"Role\" must be one of [P, D, L, A, ]');

    await app.close();
    await done();

  });

  it('Should test the get users endpoint with a page parameter and return a success message', async (done) => {

    const page = 2;
    const response = await supertest(app).get(`/api/${config.api.version}/users?page=${page}`);

    expect(response.status).toBe(200);
    expect(response.error).toBe(false);

    expect(response.body.message.currentPage).toBe(page);

    await app.close();
    await done();

  });
});

describe('Testing the GET [user] endpoint', () => {

  it('Should test the get user endpoint with valid userId parameter and return an success message', async (done) => {

    const userId = '5eb8c73377d75e0b8a77d9b4';
    const response = await supertest(app).get(`/api/${config.api.version}/users/${userId}`);

    expect(response.status).toBe(200);
    expect(response.error).toBe(false);

    expect(response.body.message).toHaveProperty('_id', userId);

    await app.close();
    await done();

  });

  it('Should test the get user endpoint with valid non-existent userId parameter and return an success message', async (done) => {

    const userId = '5ebb7404463b3a27e8e9cea3';
    const response = await supertest(app).get(`/api/${config.api.version}/users/${userId}`);

    expect(response.status).toBe(200);
    expect(response.error).toBe(false);

    expect(response.body.message).toEqual({});

    await app.close();
    await done();

  });

  it('Should test the get user endpoint with invalid userId parameter and return an error message', async (done) => {

    const invalidUserId = '5ebb7404463b3a27e8e9cea';
    const response = await supertest(app).get(`/api/${config.api.version}/users/${invalidUserId}`);

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Bad Request');
    expect(response.body.message).toBe(`\"userId\" with value \"${invalidUserId}\" fails to match the required pattern: /^[0-9a-fA-F]{24}$/`);

    await app.close();
    await done();

  });
});

describe('Testing the POST [login] endpoint', () => {
  it('Should test the login users endpoint and return the auth token', async (done) => {
    const response = await supertest(app).post(`/api/${config.api.version}/users/login`).send(userLoginMock);
    expect(response.error).toBe(false);
    expect(response.status).toBe(200);
    expect(response.body.message).toHaveProperty('jwt');

    await app.close();
    await done();
  });

  it('Should test the login users endpoint and error', async (done) => {
    const response = await supertest(app).post(`/api/${config.api.version}/users/login`).send(userLoginFailMock);
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Bad Request');
    expect(response.body.message).toBe('Username or password is incorrect');

    await app.close();
    await done();
  });
});

describe('Testing the PUT [user] endpoint', () => {

  it('Should test the update users endpoint and return a success message then delete it with delete user endpoint', async (done) => {

    const response = await supertest(app).post(`/api/${config.api.version}/users`).send(createUserSuccess);

    expect(response.error).toBe(false);
    expect(response.status).toBe(201);
    expect(response.body.message.insertedCount).toBe(1);

    const updatedResponse = await supertest(app).put(`/api/${config.api.version}/users/${response.body.message.insertedId}`).send(updateUserSuccess);

    expect(updatedResponse.error).toBe(false);
    expect(updatedResponse.status).toBe(200);
    expect(updatedResponse.body.message.matchedCount).toBe(1);
    expect(updatedResponse.body.message.updatedCount).toBe(1);

    const deletedResponse = await supertest(app).delete(`/api/${config.api.version}/users/${response.body.message.insertedId}`);

    expect(deletedResponse.error).toBe(false);
    expect(deletedResponse.status).toBe(200);
    expect(deletedResponse.body.message.deletedId).toHaveLength(24);
    expect(deletedResponse.body.message.deletedCount).toBe(1);

    await app.close();
    await done();
  });

  it('Should test the update users endpoint updating a forbidden property and return an error message', async (done) => {

    const userId = '111111111111111111111111';
    const updatedResponse = await supertest(app).put(`/api/${config.api.version}/users/${userId}`).send(updateUserForbiddenPropertyError);

    expect(updatedResponse.body.error).toBe('Bad Request');
    expect(updatedResponse.status).toBe(400);
    expect(updatedResponse.body.message).toBe('\"auth.role\" is not allowed');

    await app.close();
    await done();
  });

  it('Should test the update users endpoint updating an incorrect userId and return an error message', async (done) => {

    const incorrectUserId = '11111111111111111111111';
    const updatedResponse = await supertest(app).put(`/api/${config.api.version}/users/${incorrectUserId}`).send(updateUserSuccess);

    expect(updatedResponse.body.error).toBe('Bad Request');
    expect(updatedResponse.status).toBe(400);
    expect(updatedResponse.body.message).toBe(`\"userId\" with value \"${incorrectUserId}\" fails to match the required pattern: /^[0-9a-fA-F]{24}$/`);

    await app.close();
    await done();
  });

  it('Should test the update users endpoint updating an invalid property and return an error message', async (done) => {

    const userId = '111111111111111111111111';
    const updatedResponse = await supertest(app).put(`/api/${config.api.version}/users/${userId}`).send(updateUserInvalidPropertyError);

    expect(updatedResponse.body.error).toBe('Bad Request');
    expect(updatedResponse.status).toBe(400);
    expect(updatedResponse.body.message).toBe('\"Phone number\" length must be at least 13 characters long');

    await app.close();
    await done();
  });

  it('Should test the update users endpoint updating an non-existent userId and return a success message', async (done) => {

    const userId = '111111111111111111111111';
    const updatedResponse = await supertest(app).put(`/api/${config.api.version}/users/${userId}`).send(updateUserSuccess);

    expect(updatedResponse.error).toBe(false);
    expect(updatedResponse.status).toBe(200);
    expect(updatedResponse.body.message.matchedCount).toBe(0);
    expect(updatedResponse.body.message.updatedCount).toBe(0);

    await app.close();
    await done();
  });
});

describe('Testing the DELETE [user] endpoint', () => {
  it('Should test the delete users endpoint deleting an non-existent userId and return a success message', async (done) => {

    const userId = '111111111111111111111111';
    const deletedResponse = await supertest(app).delete(`/api/${config.api.version}/users/${userId}`);

    expect(deletedResponse.error).toBe(false);
    expect(deletedResponse.status).toBe(200);
    expect(deletedResponse.body.message.deletedId).toBe(0);
    expect(deletedResponse.body.message.deletedCount).toBe(0);

    await app.close();
    await done();
  });
});

describe('Testing the GET [user/profile] endpoint', () => {

  it('Should test the get user/profile endpoint and return a success message', async (done) => {

    const response = await supertest(app).post(`/api/${config.api.version}/users`).send(createUserSuccess);

    expect(response.error).toBe(false);
    expect(response.status).toBe(201);
    expect(response.body.message.insertedId).toHaveLength(24);
    expect(response.body.message.insertedCount).toBe(1);

    const getResponse = await supertest(app).get(`/api/${config.api.version}/users/${response.body.message.insertedId}/profile`);

    expect(getResponse.error).toBe(false);
    expect(getResponse.status).toBe(200);
    //expect(getResponse.body.message._id).toHaveLength(24);
    expect(getResponse.body.message).toHaveProperty('profile');

    const deletedResponse = await supertest(app).delete(`/api/${config.api.version}/users/${response.body.message.insertedId}`);

    expect(deletedResponse.error).toBe(false);
    expect(deletedResponse.status).toBe(200);
    expect(deletedResponse.body.message.deletedId).toHaveLength(24);
    expect(deletedResponse.body.message.deletedCount).toBe(1);

    await app.close();
    await done();
  });
});

describe('Testing the PUT [user/profile] endpoint', () => {

  it('Should test the update user/profile endpoint and return a success message', async (done) => {

    const response = await supertest(app).post(`/api/${config.api.version}/users`).send(createUserSuccess);

    expect(response.error).toBe(false);
    expect(response.status).toBe(201);
    expect(response.body.message.insertedId).toHaveLength(24);
    expect(response.body.message.insertedCount).toBe(1);

    const updatedResponse = await supertest(app).put(`/api/${config.api.version}/users/${response.body.message.insertedId}/profile`).send(updateUserProfileSuccess);

    expect(updatedResponse.error).toBe(false);
    expect(updatedResponse.status).toBe(200);
    expect(updatedResponse.body.message.matchedCount).toBe(1);
    expect(updatedResponse.body.message.updatedCount).toBe(1);

    const deletedResponse = await supertest(app).delete(`/api/${config.api.version}/users/${response.body.message.insertedId}`);

    expect(deletedResponse.error).toBe(false);
    expect(deletedResponse.status).toBe(200);
    expect(deletedResponse.body.message.deletedId).toHaveLength(24);
    expect(deletedResponse.body.message.deletedCount).toBe(1);

    await app.close();
    await done();
  });

  it('Should test the update user/profile endpoint updating a forbidden property and return an error message', async (done) => {

    const userId = '111111111111111111111111';
    const updatedResponse = await supertest(app).put(`/api/${config.api.version}/users/${userId}/profile`).send(updateUserForbiddenPropertyError);

    expect(updatedResponse.body.error).toBe('Bad Request');
    expect(updatedResponse.status).toBe(400);
    expect(updatedResponse.body.message).toBe('\"auth\" is not allowed');

    await app.close();
    await done();
  });

  it('Should test the update user/profile endpoint updating an incorrect userId and return an error message', async (done) => {

    const incorrectUserId = '11111111111111111111111';
    const updatedResponse = await supertest(app).put(`/api/${config.api.version}/users/${incorrectUserId}/profile`).send(updateUserProfileSuccess);

    expect(updatedResponse.body.error).toBe('Bad Request');
    expect(updatedResponse.status).toBe(400);
    expect(updatedResponse.body.message).toBe(`\"userId\" with value "${incorrectUserId}" fails to match the required pattern: /^[0-9a-fA-F]{24}$/`);

    await app.close();
    await done();
  });

  it('Should test the update user/profile endpoint updating an invalid property and return an error message', async (done) => {

    const userId = '111111111111111111111111';
    const updatedResponse = await supertest(app).put(`/api/${config.api.version}/users/${userId}/profile`).send(updateUserProfileInvalidPropertyError);

    expect(updatedResponse.body.error).toBe('Bad Request');
    expect(updatedResponse.status).toBe(400);
    expect(updatedResponse.body.message).toBe('\"Phone number\" length must be at least 13 characters long');

    await app.close();
    await done();
  });

  it('Should test the update users endpoint updating an non-existent userId and return a success message', async (done) => {

    const userId = '111111111111111111111111';
    const updatedResponse = await supertest(app).put(`/api/${config.api.version}/users/${userId}/profile`).send(updateUserProfileSuccess);

    expect(updatedResponse.error).toBe(false);
    expect(updatedResponse.status).toBe(200);
    expect(updatedResponse.body.message.matchedCount).toBe(0);
    expect(updatedResponse.body.message.updatedCount).toBe(0);

    await app.close();
    await done();
  });
});

describe('Testing the POST [user/tests] endpoint', () => {

  it('Should test the create user/tests endpoint and return a success message', async (done) => {

    const response = await supertest(app).post(`/api/${config.api.version}/users`).send(createUserSuccess);

    expect(response.error).toBe(false);
    expect(response.status).toBe(201);
    expect(response.body.message.insertedId).toHaveLength(24);
    expect(response.body.message.insertedCount).toBe(1);

    const updatedResponse = await supertest(app).post(`/api/${config.api.version}/users/${response.body.message.insertedId}/tests`).send(createUserTestSuccess);

    expect(updatedResponse.error).toBe(false);
    expect(updatedResponse.status).toBe(200);
    expect(updatedResponse.body.message.matchedCount).toBe(1);
    expect(updatedResponse.body.message.updatedCount).toBe(1);

    const deletedResponse = await supertest(app).delete(`/api/${config.api.version}/users/${response.body.message.insertedId}`);

    expect(deletedResponse.error).toBe(false);
    expect(deletedResponse.status).toBe(200);
    expect(deletedResponse.body.message.deletedId).toHaveLength(24);
    expect(deletedResponse.body.message.deletedCount).toBe(1);

    await app.close();
    await done();
  });

  it('Should test the create user/tests endpoint with a duplicated test and return a error message', async (done) => {

    const response = await supertest(app).post(`/api/${config.api.version}/users`).send(createUserSuccess);

    expect(response.error).toBe(false);
    expect(response.status).toBe(201);
    expect(response.body.message.insertedId).toHaveLength(24);
    expect(response.body.message.insertedCount).toBe(1);

    const updatedResponse = await supertest(app).post(`/api/${config.api.version}/users/${response.body.message.insertedId}/tests`).send(createUserTestSuccess);

    expect(updatedResponse.error).toBe(false);
    expect(updatedResponse.status).toBe(200);
    expect(updatedResponse.body.message.matchedCount).toBe(1);
    expect(updatedResponse.body.message.updatedCount).toBe(1);

    const createSameTestResponse = await supertest(app).post(`/api/${config.api.version}/users/${response.body.message.insertedId}/tests`).send(createUserTestSuccess);

    expect(createSameTestResponse.body.error).toBe('Bad Request');
    expect(createSameTestResponse.status).toBe(400);
    expect(createSameTestResponse.body.message).toBe('Error: A pending medical test already exists in user');

    const deletedResponse = await supertest(app).delete(`/api/${config.api.version}/users/${response.body.message.insertedId}`);

    expect(deletedResponse.error).toBe(false);
    expect(deletedResponse.status).toBe(200);
    expect(deletedResponse.body.message.deletedId).toHaveLength(24);
    expect(deletedResponse.body.message.deletedCount).toBe(1);

    await app.close();
    await done();
  });
});

describe('Testing the GET [user/tests] endpoint', () => {
  it('Should test the get user/tests endpoint with done status and return a success message', async (done) => {

    const userId = '5ec5f50ea76d8d1b91de94e5';
    const response = await supertest(app).get(`/api/${config.api.version}/users/${userId}/tests?status=D`);

    expect(response.error).toBe(false);
    expect(response.status).toBe(200);
    expect(response.body.message).toHaveProperty(['tests', 0, 'status'], 'DONE' || {});

    await app.close();
    await done();

  });

  it('Should test the get user/tests endpoint with pending status and return a success message', async (done) => {

    const userId = '5ec5f50ea76d8d1b91de94e5';
    const response = await supertest(app).get(`/api/${config.api.version}/users/${userId}/tests?status=P`);

    expect(response.error).toBe(false);
    expect(response.status).toBe(200);
    expect(response.body.message).toHaveProperty(['tests', 0, 'status'], 'PENDING' || {});

    await app.close();
    await done();

  });

});

describe('Testing the GET [user/test] endpoint', () => {
  it('Should test the get user/test endpoint and return a success message', async (done) => {

    const userId = '111111111111111111111111';
    const testId = 'SqjEUEqZyh0BJbrP6H1mX';
    const response = await supertest(app).get(`/api/${config.api.version}/users/${userId}/tests/${testId}`);

    expect(response.error).toBe(false);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('User doesn\'t exists');

    await app.close();
    await done();

  });

  it('Should test the get user/test endpoint with an incorrect testId and return a warning message', async (done) => {

    const userId = '111111111111111111111111';
    const testId = 'SqjEUEqZyh0BJbrP6H1m';
    const response = await supertest(app).get(`/api/${config.api.version}/users/${userId}/tests/${testId}`);

    expect(response.body.error).toBe('Bad Request');
    expect(response.status).toBe(400);
    expect(response.body.message).toBe(`\"testId\" with value \"${testId}\" fails to match the required pattern: /^[0-9a-zA-Z_/-]{21}$/`);

    await app.close();
    await done();

  });

});

describe('Testing the DELETE [user/test] endpoint', () => {

  it('Should test the delete test endpoint and return a success message', async (done) => {

    const userId = '5ec1c0336ac96a15145fe896';
    const testId = 'e5-l2QGl_R0ZHeonwp5fU';
    const deletedResponse = await supertest(app).delete(`/api/${config.api.version}/users/${userId}/tests/${testId}`);

    expect(deletedResponse.error).toBe(false);
    expect(deletedResponse.status).toBe(200);
    expect(deletedResponse.body.message).toBe('Cannot delete because it has results');

    await app.close();
    await done();
  });

  it('Should test the delete test endpoint and return a success message', async (done) => {

    const userId = '5ec1c0336ac96a15145fe896';
    const testId = '000000000000000000003';
    const deletedResponse = await supertest(app).delete(`/api/${config.api.version}/users/${userId}/tests/${testId}`);

    expect(deletedResponse.error).toBe(false);
    expect(deletedResponse.status).toBe(200);
    expect(deletedResponse.body.message.matchedCount).toBe(1);
    expect(deletedResponse.body.message.updatedCount).toBe(1);

    await app.close();
    await done();
  });

  it('Should test the delete test endpoint with and inexistent user and return a success message', async (done) => {

    const userId = '111111111111111111111111';
    const testId = 'U1wBq5pfs-3IX4EfMZomh';
    const deletedResponse = await supertest(app).delete(`/api/${config.api.version}/users/${userId}/tests/${testId}`);

    expect(deletedResponse.error).toBe(false);
    expect(deletedResponse.status).toBe(200);
    expect(deletedResponse.body.message.matchedCount).toBe(0);
    expect(deletedResponse.body.message.updatedCount).toBe(0);

    await app.close();
    await done();
  });
});

describe('Testing the PUT [user/test] endpoint', () => {
  it('Should test the update user/test endpoint and return a success message', async (done) => {
    const userId = '5ec1c0336ac96a15145fe896';
    const testId = 'e5-l2QGl_R0ZHeonwp5fU';
    const values = ['POSITIVO', 'NEGATIVO', 'UNDEFINED', 'PENDING'];

    const payload = {
      'testName': 'Análisis Sanguineo',
      'doctorName': 'José Francisco',
      'doctorId': '5e30b94546fc3f5c223c4254',
      'status': values[Math.floor(Math.random() * values.length)],
    };

    const response = await supertest(app)
      .put(`/api/${config.api.version}/users/${userId}/tests/${testId}`)
      .send(payload);

    expect(response.error).toBe(false);
    expect(response.status).toBe(200);
    expect(response.body.message).toHaveProperty('matchedCount');
    expect(response.body.message.matchedCount).toBe(1);
    expect(response.body.message).toHaveProperty('updatedCount');
    expect(response.body.message.updatedCount).toBe(1);

    await app.close();
    await done();

  });

  it('Should test the update user/test endpoint and return a message with zero updatedCount', async (done) => {

    const userId = '5ec1c0336ac96a15145fe896';
    const testId = 'e5-l2QGl_R0ZHeonwp5fr';
    const payload = {
      'testName': 'Análisis Sanguineo',
      'doctorName': 'Juan Francisco',
      'doctorId': '5e30b94546fc3f5c223c4254',
      'status': 'PENDING',
    };

    const response = await supertest(app)
      .put(`/api/${config.api.version}/users/${userId}/tests/${testId}`)
      .send(payload);

    expect(response.error).toBe(false);
    expect(response.status).toBe(200);
    expect(response.body.message).toHaveProperty('matchedCount');
    expect(response.body.message.matchedCount).toBe(0);
    expect(response.body.message).toHaveProperty('updatedCount');
    expect(response.body.message.updatedCount).toBe(0);

    await app.close();
    await done();

  });

});

describe('Testing the PUT [user/results] endpoint', () => {
  it('Should test the update user/test/results endpoint and return a success message', async (done) => {
    const userId = '5ec1c0336ac96a15145fe896';
    const testId = 'e5-l2QGl_R0ZHeonwp5fU';
    const values = ['POSITIVO', 'NEGATIVO', 'UNDEFINED', 'PENDING'];

    const payload = {
      'results': {
        'COVID-19': values[Math.floor(Math.random() * values.length)],
        'SARS': values[Math.floor(Math.random() * values.length)],
        'MERS': values[Math.floor(Math.random() * values.length)],
      },
    };

    const response = await supertest(app)
      .put(`/api/${config.api.version}/users/${userId}/tests/${testId}/results`)
      .send(payload);

    expect(response.error).toBe(false);
    expect(response.status).toBe(200);
    expect(response.body.message).toHaveProperty('matchedCount');
    expect(response.body.message.matchedCount).toBe(1);
    expect(response.body.message).toHaveProperty('updatedCount');
    expect(response.body.message.updatedCount).toBe(1);

    await app.close();
    await done();

  });

  it('Should test the update user/test/results endpoint and return a success message', async (done) => {
    const userId = '5ec1c0336ac96a15145fe896';
    const testId = 'e5-l2QGl_R0ZHeonwp5fU';
    const values = ['POSITIVO', 'NEGATIVO', 'UNDEFINED', 'PENDING'];

    const payload = {
      'results': {
        'COVID-19': values[Math.floor(Math.random() * values.length)],
        'SARS': values[Math.floor(Math.random() * values.length)],
        'MERS': values[Math.floor(Math.random() * values.length)],
      },
    };

    const response = await supertest(app)
      .put(`/api/${config.api.version}/users/${userId}/tests/${testId}/results`)
      .send(payload);

    expect(response.error).toBe(false);
    expect(response.status).toBe(200);
    expect(response.body.message).toHaveProperty('matchedCount');
    expect(response.body.message.matchedCount).toBe(1);
    expect(response.body.message).toHaveProperty('updatedCount');
    expect(response.body.message.updatedCount).toBe(1);

    await app.close();
    await done();
  });

  it('Should test the update user/test/results endpoint and return a fail message advising about key ', async (done) => {
    const userId = '5ec1c0336ac96a15145fe896';
    const testId = 'e5-l2QGl_R0ZHeonwp5fU';
    const values = ['POSITIVO', 'NEGATIVO', 'UNDEFINED', 'PENDING'];

    const payload = {
      'result': {
        'COVID-19': values[Math.floor(Math.random() * values.length)],
        'SARS': values[Math.floor(Math.random() * values.length)],
        'MERS': values[Math.floor(Math.random() * values.length)],
      },
    };

    const response = await supertest(app)
      .put(`/api/${config.api.version}/users/${userId}/tests/${testId}/results`)
      .send(payload);

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Bad Request');
    expect(response.body.message).toBe('Error: Object to update must contain results key');

    await app.close();
    await done();
  });

  it('Should test the update user/test/results endpoint and return a fail message advising about empty payload ', async (done) => {
    const userId = '5ec1c0336ac96a15145fe896';
    const testId = 'e5-l2QGl_R0ZHeonwp5fU';
    const payload = {};

    const response = await supertest(app)
      .put(`/api/${config.api.version}/users/${userId}/tests/${testId}/results`)
      .send(payload);

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Bad Request');
    expect(response.body.message).toBe('Error: Object to update must not be empty');

    await app.close();
    await done();
  });
});

describe('Testing the GET [user/test/results] endpoint', () => {
  it('Should test the get user/test/results endpoint and return a success message', async (done) => {

    const userId = '5ec1c0336ac96a15145fe896';
    const testId = 'e5-l2QGl_R0ZHeonwp5fU';
    const response = await supertest(app).get(`/api/${config.api.version}/users/${userId}/tests/${testId}/results`);

    expect(response.error).toBe(false);
    expect(response.status).toBe(200);
    expect(response.body.message).toHaveProperty('results');

    await app.close();
    await done();

  });

  it('Should test the get user/test/results endpoint with an incorrect testId and return a warning message', async (done) => {

    const userId = '5ec1c0336ac96a15145fe896';
    const testId = 'SqjEUEqZyh0BJbrP6H1m';
    const response = await supertest(app).get(`/api/${config.api.version}/users/${userId}/tests/${testId}`);

    expect(response.body.error).toBe('Bad Request');
    expect(response.status).toBe(400);
    expect(response.body.message).toBe(`\"testId\" with value \"${testId}\" fails to match the required pattern: /^[0-9a-zA-Z_/-]{21}$/`);

    await app.close();
    await done();

  });

  it('Should test the get user/test/results endpoint with an incorrect userId and return a warning message', async (done) => {

    const userId = '5ec1c0336ac96a15145fe89';
    const testId = 'SqjEUEqZyh0BJbrP6H1mX';
    const response = await supertest(app).get(`/api/${config.api.version}/users/${userId}/tests/${testId}`);

    expect(response.body.error).toBe('Bad Request');
    expect(response.status).toBe(400);
    expect(response.body.message).toBe(`\"userId\" with value \"${userId}\" fails to match the required pattern: /^[0-9a-fA-F]{24}$/`);

    await app.close();
    await done();

  });

  it('Should test the get user/test/results endpoint without results and return null', async (done) => {

    const userId = '111111111111111111111111';
    const testId = 'SqjEUEqZyh0BJbrP6H1mX';
    const response = await supertest(app).get(`/api/${config.api.version}/users/${userId}/tests/${testId}/results`);

    expect(response.error).toBe(false);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe(null);

    await app.close();
    await done();

    afterAll = () => {
      store.client.close();
    };

  });

});
