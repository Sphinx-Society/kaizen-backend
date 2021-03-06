const supertest = require('supertest');
const app = require('../../server');
const config = require('../../config');
const messages = require('../../config/messages');
const MongoLib = require('../../store/mongo');
const {
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
} = require('../../utils/mocks/createUserMock');

const {
  updateUserSuccess,
  updateUserForbiddenPropertyError,
  updateUserInvalidPropertyError,
  updateUserProfileSuccess,
  updateUserProfileInvalidPropertyError,
  createUserTestSuccess,
} = require('../../utils/mocks/updateUserMock');

const { userLoginMock, userLoginFailMock, bearerToken } = require('../../utils/mocks/userLoginMock');

const store = new MongoLib();
const token = bearerToken;

afterAll = async (done) => {
  await app.close();
  await done();
  await store.client.close();
};

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

    const response = await supertest(app).post(`/api/${config.api.version}/users`).send(createUserSuccess).set('Authorization', `bearer ${token}`);

    expect(response.error).toBe(false);
    expect(response.status).toBe(201);
    expect(response.body.message.insertedId).toHaveLength(24);
    expect(response.body.message.insertedCount).toBe(1);

    await app.close();
    await done();

  });

  it('Should test the post users endpoint with a First Name error and return an error message', async (done) => {

    const response = await supertest(app).post(`/api/${config.api.version}/users`).send(createUserFirstNameError).set('Authorization', `bearer ${token}`);

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Bad Request');
    expect(response.body.message).toBe('\"First Name\" is not allowed to be empty');

    await app.close();
    await done();

  });

  it('Should test the post users endpoint with a Last Name error and returns an error message', async (done) => {

    const response = await supertest(app).post(`/api/${config.api.version}/users`).send(createUserLastNameError).set('Authorization', `bearer ${token}`);

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Bad Request');
    expect(response.body.message).toBe('\"Last Name\" is not allowed to be empty');

    await app.close();
    await done();

  });

  it('Should test the post users endpoint with a Birth Date error and returns an error message', async (done) => {

    const response = await supertest(app).post(`/api/${config.api.version}/users`).send(createUserBirthDateError).set('Authorization', `bearer ${token}`);

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Bad Request');
    expect(response.body.message).toBe('\"Birthday\" must be in timestamp or number of seconds format');

    await app.close();
    await done();

  });

  it('Should test the post users endpoint with a Phone Number format error and returns an error message', async (done) => {

    const response = await supertest(app).post(`/api/${config.api.version}/users`).send(createUserPhoneNumberError).set('Authorization', `bearer ${token}`);

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Bad Request');
    expect(response.body.message).toBe('\"Phone number\" length must be at least 13 characters long');

    await app.close();
    await done();

  });

  it('Should test the post users endpoint with a Phone Number null error and returns an error message', async (done) => {

    const response = await supertest(app).post(`/api/${config.api.version}/users`).send(createUserPhoneNumberNullError).set('Authorization', `bearer ${token}`);

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Bad Request');
    expect(response.body.message).toBe('\"Phone number\" is not allowed to be empty');

    await app.close();
    await done();

  });

  it('Should test the post users endpoint with a gender error and returns an error message', async (done) => {

    const response = await supertest(app).post(`/api/${config.api.version}/users`).send(createUserGenderError).set('Authorization', `bearer ${token}`);

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Bad Request');
    expect(response.body.message).toBe('\"Gender\" is not allowed to be empty');

    await app.close();
    await done();

  });

  it('Should test the post users endpoint with a gender error and returns an error message', async (done) => {

    const response = await supertest(app).post(`/api/${config.api.version}/users`).send(createUserCountryError).set('Authorization', `bearer ${token}`);

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Bad Request');
    expect(response.body.message).toBe('\"Country\" is not allowed to be empty');

    await app.close();
    await done();

  });

  it('Should test the post users endpoint with a gender error and returns an error message', async (done) => {

    const response = await supertest(app).post(`/api/${config.api.version}/users`).send(createUserDocumentIdError).set('Authorization', `bearer ${token}`);

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Bad Request');
    expect(response.body.message).toBe('\"Document ID\" is not allowed to be empty');

    await app.close();
    await done();

  });
  it('Should test the post users endpoint with a email format error and returns an error message', async (done) => {

    const response = await supertest(app).post(`/api/${config.api.version}/users`).send(createUserEmailError).set('Authorization', `bearer ${token}`);

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Bad Request');
    expect(response.body.message).toBe('\"Email\" must be a valid email');

    await app.close();
    await done();

  });

  it('Should test the post users endpoint with a Role error and returns an error message', async (done) => {

    const response = await supertest(app).post(`/api/${config.api.version}/users`).send(createUserRoleError).set('Authorization', `bearer ${token}`);

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Bad Request');
    expect(response.body.message).toBe('\"Role\" must be one of [patient, doctor, lab, admin]');

    await app.close();
    await done();

  });

  it('Should test the post users endpoint with a duplicated document id and return a success message', async (done) => {

    const response = await supertest(app).post(`/api/${config.api.version}/users`).send(createUserSuccess).set('Authorization', `bearer ${token}`);

    expect(response.error).toBe(false);
    expect(response.status).toBe(201);
    expect(response.body.message.insertedId).toHaveLength(24);
    expect(response.body.message.insertedCount).toBe(1);

    const deletedResponse = await store.delete('users', response.body.message.insertedId);

    expect(deletedResponse.deletedId).toHaveLength(24);
    expect(deletedResponse.deletedCount).toBe(1);

    await app.close();
    await done();

  });

  it('Should test the post users endpoint with an avatar and return a success message', async (done) => {

    const response = await supertest(app).post(`/api/${config.api.version}/users`).send(createUserAvatarSuccess).set('Authorization', `bearer ${token}`);

    expect(response.error).toBe(false);
    expect(response.status).toBe(201);
    expect(response.body.message.insertedId).toHaveLength(24);
    expect(response.body.message.insertedCount).toBe(1);

    const deletedResponse = await store.delete('users', response.body.message.insertedId);

    expect(deletedResponse.deletedId).toHaveLength(24);
    expect(deletedResponse.deletedCount).toBe(1);

    await app.close();
    await done();

  });
});

describe('Testing the GET [users] endpoint', () => {

  it('Should test the get users endpoint and return a success message', async (done) => {

    const response = await supertest(app).get(`/api/${config.api.version}/users`).set('Authorization', `bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.error).toBe(false);

    await app.close();
    await done();

  });

  it('Should test the get users endpoint with documentId parameter existing in DB and return a success message', async (done) => {

    const documentId = '12345678909';
    const response = await supertest(app).get(`/api/${config.api.version}/users?q=${documentId}`).set('Authorization', `bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.error).toBe(false);

    expect(response.body.message.users[0]).toHaveProperty(['profile', 'documentId'], documentId || {});

    await app.close();
    await done();

  });

  it('Should test the get users endpoint with documentId parameter non-existent in DB and return a success message', async (done) => {

    const documentId = '12234556778';
    const response = await supertest(app).get(`/api/${config.api.version}/users?q=${documentId}`).set('Authorization', `bearer ${token}`);

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

      const response = await supertest(app).get(`/api/${config.api.version}/users?role=${input}`).set('Authorization', `bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.error).toBe(false);
      expect(response.body.message.users[0]).toHaveProperty(['auth', 'role'], output);
      await app.close();

    },
  );

  it('Should test the get users endpoint with invalid role parameter and return an error message', async (done) => {

    const response = await supertest(app).get(`/api/${config.api.version}/users?role=xyz`).set('Authorization', `bearer ${token}`);

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Bad Request');
    expect(response.body.message).toBe('\"Role\" must be one of [P, D, L, A, ]');

    await app.close();
    await done();

  });

  it('Should test the get users endpoint with a page parameter and return a success message', async (done) => {

    const page = 2;
    const response = await supertest(app).get(`/api/${config.api.version}/users?page=${page}`).set('Authorization', `bearer ${token}`);

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
    const response = await supertest(app).get(`/api/${config.api.version}/users/${userId}`).set('Authorization', `bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.error).toBe(false);

    expect(response.body.message).toHaveProperty('_id', userId);

    await app.close();
    await done();

  });

  it('Should test the get user endpoint with valid non-existent userId parameter and return an success message', async (done) => {

    const userId = '5ebb7404463b3a27e8e9cea3';
    const response = await supertest(app).get(`/api/${config.api.version}/users/${userId}`).set('Authorization', `bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.error).toBe(false);

    expect(response.body.message).toEqual({});

    await app.close();
    await done();

  });

  it('Should test the get user endpoint with invalid userId parameter and return an error message', async (done) => {

    const invalidUserId = '5ebb7404463b3a27e8e9cea';
    const response = await supertest(app).get(`/api/${config.api.version}/users/${invalidUserId}`).set('Authorization', `bearer ${token}`);

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Bad Request');
    expect(response.body.message).toBe(`\"userId\" with value \"${invalidUserId}\" fails to match the required pattern: /^[0-9a-fA-F]{24}$/`);

    await app.close();
    await done();

  });
});

describe('Testing the POST [login] endpoint', () => {
  it('Should test the login users endpoint and return the auth token', async (done) => {
    const response = await supertest(app).post(`/api/${config.api.version}/users/login`).send(userLoginMock).set('Authorization', `bearer ${token}`);
    expect(response.error).toBe(false);
    expect(response.status).toBe(200);
    expect(response.body.message).toHaveProperty('jwt');

    await app.close();
    await done();
  });

  it('Should test the login users endpoint and error', async (done) => {
    const response = await supertest(app).post(`/api/${config.api.version}/users/login`).send(userLoginFailMock).set('Authorization', `bearer ${token}`);
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Bad Request');
    expect(response.body.message).toBe(messages.SSKB_ERROR_USER_PSWD_INCORRECT);

    await app.close();
    await done();
  });
});

describe('Testing the POST [resetPassword] endpoint', () => {
  it('Should test the resetPassword endpoint with an inexistent user and return error', async (done) => {
    const userId = '5eb8c73377d75e0b8a77d9b0';
    const response = await supertest(app).put(`/api/${config.api.version}/users/resetPassword/${userId}`).set('Authorization', `bearer ${token}`);
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Bad Request');
    expect(response.body.message).toBe(messages.SSKB_ERROR_INVALID_USER);

    await app.close();
    await done();
  });

  it('Should test the resetPassword endpoint with a valid user and return success', async (done) => {

    const userId = '5eb8c73377d75e0b8a77d9b4';
    const response = await supertest(app).put(`/api/${config.api.version}/users/resetPassword/${userId}`).set('Authorization', `bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.error).toBe(false);
    expect(response.body.message).toHaveProperty('matchedCount');
    expect(response.body.message.matchedCount).toBe(1);
    expect(response.body.message).toHaveProperty('updatedCount');
    expect(response.body.message.updatedCount).toBe(1);
    await app.close();
    await done();
  });

});

describe('Testing the PUT [user] endpoint', () => {

  it('Should test the update users endpoint and return a success message then delete it with delete user endpoint', async (done) => {

    const response = await supertest(app).post(`/api/${config.api.version}/users`).send(createUserSuccess).set('Authorization', `bearer ${token}`);

    expect(response.error).toBe(false);
    expect(response.status).toBe(201);
    expect(response.body.message.insertedCount).toBe(1);

    const updatedResponse = await supertest(app).put(`/api/${config.api.version}/users/${response.body.message.insertedId}`).send(updateUserSuccess).set('Authorization', `bearer ${token}`);

    expect(updatedResponse.error).toBe(false);
    expect(updatedResponse.status).toBe(200);
    expect(updatedResponse.body.message.matchedCount).toBe(1);
    expect(updatedResponse.body.message.updatedCount).toBe(1);

    const deletedResponse = await store.delete('users', response.body.message.insertedId);

    expect(deletedResponse.deletedId).toHaveLength(24);
    expect(deletedResponse.deletedCount).toBe(1);

    await app.close();
    await done();
  });

  it('Should test the update users endpoint updating a forbidden property and return an error message', async (done) => {

    const userId = '111111111111111111111111';
    const updatedResponse = await supertest(app).put(`/api/${config.api.version}/users/${userId}`).send(updateUserForbiddenPropertyError).set('Authorization', `bearer ${token}`);

    expect(updatedResponse.body.error).toBe('Bad Request');
    expect(updatedResponse.status).toBe(400);
    expect(updatedResponse.body.message).toBe('\"auth.role\" is not allowed');

    await app.close();
    await done();
  });

  it('Should test the update users endpoint updating an incorrect userId and return an error message', async (done) => {

    const incorrectUserId = '11111111111111111111111';
    const updatedResponse = await supertest(app).put(`/api/${config.api.version}/users/${incorrectUserId}`).send(updateUserSuccess).set('Authorization', `bearer ${token}`);

    expect(updatedResponse.body.error).toBe('Bad Request');
    expect(updatedResponse.status).toBe(400);
    expect(updatedResponse.body.message).toBe(`\"userId\" with value \"${incorrectUserId}\" fails to match the required pattern: /^[0-9a-fA-F]{24}$/`);

    await app.close();
    await done();
  });

  it('Should test the update users endpoint updating an invalid property and return an error message', async (done) => {

    const userId = '111111111111111111111111';
    const updatedResponse = await supertest(app).put(`/api/${config.api.version}/users/${userId}`).send(updateUserInvalidPropertyError).set('Authorization', `bearer ${token}`);

    expect(updatedResponse.body.error).toBe('Bad Request');
    expect(updatedResponse.status).toBe(400);
    expect(updatedResponse.body.message).toBe('\"Phone number\" length must be at least 13 characters long');

    await app.close();
    await done();
  });

  it('Should test the update users endpoint updating an non-existent userId and return a success message', async (done) => {

    const userId = '111111111111111111111111';
    const updatedResponse = await supertest(app).put(`/api/${config.api.version}/users/${userId}`).send(updateUserSuccess).set('Authorization', `bearer ${token}`);

    expect(updatedResponse.error).toBe(false);
    expect(updatedResponse.status).toBe(200);
    expect(updatedResponse.body.message.matchedCount).toBe(0);
    expect(updatedResponse.body.message.updatedCount).toBe(0);

    await app.close();
    await done();
  });
});

describe('Testing the DELETE [user] endpoint', () => {
  it('Should test the delete users endpoint deleting a userId and return a success message', async (done) => {

    const response = await supertest(app).post(`/api/${config.api.version}/users`).send(createUserSuccess).set('Authorization', `bearer ${token}`);

    expect(response.error).toBe(false);
    expect(response.status).toBe(201);
    expect(response.body.message.insertedId).toHaveLength(24);
    expect(response.body.message.insertedCount).toBe(1);

    const deletedResponse = await supertest(app).delete(`/api/${config.api.version}/users/${response.body.message.insertedId}`).set('Authorization', `bearer ${token}`);

    expect(deletedResponse.error).toBe(false);
    expect(deletedResponse.status).toBe(200);
    expect(deletedResponse.body.message.matchedCount).toBe(1);
    expect(deletedResponse.body.message.updatedCount).toBe(1);

    const userDeleted = await store.delete('users', response.body.message.insertedId);

    expect(userDeleted.deletedId).toHaveLength(24);
    expect(userDeleted.deletedCount).toBe(1);

    await app.close();
    await done();
  });

  it('Should test the delete users endpoint deleting an non-existent userId and return a success message', async (done) => {

    const userId = '111111111111111111111111';
    const deletedResponse = await supertest(app).delete(`/api/${config.api.version}/users/${userId}`).set('Authorization', `bearer ${token}`);

    expect(deletedResponse.error).toBe(false);
    expect(deletedResponse.status).toBe(200);
    expect(deletedResponse.body.message.matchedCount).toBe(0);
    expect(deletedResponse.body.message.updatedCount).toBe(0);

    await app.close();
    await done();
  });
});

describe('Testing the GET [user/profile] endpoint', () => {

  it('Should test the get user/profile endpoint and return a success message', async (done) => {

    const response = await supertest(app).post(`/api/${config.api.version}/users`).send(createUserSuccess).set('Authorization', `bearer ${token}`);

    expect(response.error).toBe(false);
    expect(response.status).toBe(201);
    expect(response.body.message.insertedId).toHaveLength(24);
    expect(response.body.message.insertedCount).toBe(1);

    const getResponse = await supertest(app).get(`/api/${config.api.version}/users/${response.body.message.insertedId}/profile`).set('Authorization', `bearer ${token}`);

    expect(getResponse.error).toBe(false);
    expect(getResponse.status).toBe(200);
    //expect(getResponse.body.message._id).toHaveLength(24);
    expect(getResponse.body.message).toHaveProperty('profile');

    const deletedResponse = await store.delete('users', response.body.message.insertedId);

    expect(deletedResponse.deletedId).toHaveLength(24);
    expect(deletedResponse.deletedCount).toBe(1);

    await app.close();
    await done();
  });
});

describe('Testing the PUT [user/profile] endpoint', () => {

  it('Should test the update user/profile endpoint and return a success message', async (done) => {

    const response = await supertest(app).post(`/api/${config.api.version}/users`).send(createUserSuccess).set('Authorization', `bearer ${token}`);

    expect(response.error).toBe(false);
    expect(response.status).toBe(201);
    expect(response.body.message.insertedId).toHaveLength(24);
    expect(response.body.message.insertedCount).toBe(1);

    const updatedResponse = await supertest(app).put(`/api/${config.api.version}/users/${response.body.message.insertedId}/profile`).send(updateUserProfileSuccess).set('Authorization', `bearer ${token}`);

    expect(updatedResponse.error).toBe(false);
    expect(updatedResponse.status).toBe(200);
    expect(updatedResponse.body.message.matchedCount).toBe(1);
    expect(updatedResponse.body.message.updatedCount).toBe(1);

    const deletedResponse = await store.delete('users', response.body.message.insertedId);

    expect(deletedResponse.deletedId).toHaveLength(24);
    expect(deletedResponse.deletedCount).toBe(1);
    await app.close();
    await done();
  });

  it('Should test the update user/profile endpoint updating a forbidden property and return an error message', async (done) => {

    const userId = '111111111111111111111111';
    const updatedResponse = await supertest(app).put(`/api/${config.api.version}/users/${userId}/profile`).send(updateUserForbiddenPropertyError).set('Authorization', `bearer ${token}`);

    expect(updatedResponse.body.error).toBe('Bad Request');
    expect(updatedResponse.status).toBe(400);
    expect(updatedResponse.body.message).toBe('\"auth\" is not allowed');

    await app.close();
    await done();
  });

  it('Should test the update user/profile endpoint updating an incorrect userId and return an error message', async (done) => {

    const incorrectUserId = '11111111111111111111111';
    const updatedResponse = await supertest(app).put(`/api/${config.api.version}/users/${incorrectUserId}/profile`).send(updateUserProfileSuccess).set('Authorization', `bearer ${token}`);

    expect(updatedResponse.body.error).toBe('Bad Request');
    expect(updatedResponse.status).toBe(400);
    expect(updatedResponse.body.message).toBe(`\"userId\" with value "${incorrectUserId}" fails to match the required pattern: /^[0-9a-fA-F]{24}$/`);

    await app.close();
    await done();
  });

  it('Should test the update user/profile endpoint updating an invalid property and return an error message', async (done) => {

    const userId = '111111111111111111111111';
    const updatedResponse = await supertest(app).put(`/api/${config.api.version}/users/${userId}/profile`).send(updateUserProfileInvalidPropertyError).set('Authorization', `bearer ${token}`);

    expect(updatedResponse.body.error).toBe('Bad Request');
    expect(updatedResponse.status).toBe(400);
    expect(updatedResponse.body.message).toBe('\"Phone number\" length must be at least 13 characters long');

    await app.close();
    await done();
  });

  it('Should test the update users endpoint updating an non-existent userId and return a success message', async (done) => {

    const userId = '111111111111111111111111';
    const updatedResponse = await supertest(app).put(`/api/${config.api.version}/users/${userId}/profile`).send(updateUserProfileSuccess).set('Authorization', `bearer ${token}`);

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

    const response = await supertest(app).post(`/api/${config.api.version}/users`).send(createUserSuccess).set('Authorization', `bearer ${token}`);

    expect(response.error).toBe(false);
    expect(response.status).toBe(201);
    expect(response.body.message.insertedId).toHaveLength(24);
    expect(response.body.message.insertedCount).toBe(1);

    const updatedResponse = await supertest(app).post(`/api/${config.api.version}/users/${response.body.message.insertedId}/tests`).send(createUserTestSuccess).set('Authorization', `bearer ${token}`);

    expect(updatedResponse.error).toBe(false);
    expect(updatedResponse.status).toBe(200);
    expect(updatedResponse.body.message.matchedCount).toBe(1);
    expect(updatedResponse.body.message.updatedCount).toBe(1);

    const deletedResponse = await store.delete('users', response.body.message.insertedId);

    expect(deletedResponse.deletedId).toHaveLength(24);
    expect(deletedResponse.deletedCount).toBe(1);

    await app.close();
    await done();
  });

  it('Should test the create user/tests endpoint with a duplicated test and return a error message', async (done) => {

    const response = await supertest(app).post(`/api/${config.api.version}/users`).send(createUserSuccess).set('Authorization', `bearer ${token}`);

    expect(response.error).toBe(false);
    expect(response.status).toBe(201);
    expect(response.body.message.insertedId).toHaveLength(24);
    expect(response.body.message.insertedCount).toBe(1);

    const updatedResponse = await supertest(app).post(`/api/${config.api.version}/users/${response.body.message.insertedId}/tests`).send(createUserTestSuccess).set('Authorization', `bearer ${token}`);

    expect(updatedResponse.error).toBe(false);
    expect(updatedResponse.status).toBe(200);
    expect(updatedResponse.body.message.matchedCount).toBe(1);
    expect(updatedResponse.body.message.updatedCount).toBe(1);

    const createSameTestResponse = await supertest(app).post(`/api/${config.api.version}/users/${response.body.message.insertedId}/tests`).send(createUserTestSuccess).set('Authorization', `bearer ${token}`);

    expect(createSameTestResponse.body.error).toBe('Bad Request');
    expect(createSameTestResponse.status).toBe(400);
    expect(createSameTestResponse.body.message).toBe(messages.SSKB_ERROR_PENDING_TEST);

    const deletedResponse = await store.delete('users', response.body.message.insertedId);

    expect(deletedResponse.deletedId).toHaveLength(24);
    expect(deletedResponse.deletedCount).toBe(1);

    await app.close();
    await done();
  });
});

describe('Testing the GET [user/tests] endpoint', () => {
  it('Should test the get user/tests endpoint with done status and return a success message', async (done) => {

    const userId = '5ec5f50ea76d8d1b91de94e5';
    const response = await supertest(app).get(`/api/${config.api.version}/users/${userId}/tests?status=D`).set('Authorization', `bearer ${token}`);

    expect(response.error).toBe(false);
    expect(response.status).toBe(200);
    expect(response.body.message).toHaveProperty(['tests', 0, 'status'], 'DONE' || {});

    await app.close();
    await done();

  });

  it('Should test the get user/tests endpoint with pending status and return a success message', async (done) => {

    const userId = '5ec5f50ea76d8d1b91de94e5';
    const response = await supertest(app).get(`/api/${config.api.version}/users/${userId}/tests?status=P`).set('Authorization', `bearer ${token}`);

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
    const response = await supertest(app).get(`/api/${config.api.version}/users/${userId}/tests/${testId}`).set('Authorization', `bearer ${token}`);

    expect(response.error).toBe(false);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe(messages.SSKB_ERROR_USER_DOESNT_EXISTS);

    await app.close();
    await done();

  });

  it('Should test the get user/test endpoint with an incorrect testId and return a warning message', async (done) => {

    const userId = '111111111111111111111111';
    const testId = 'SqjEUEqZyh0BJbrP6H1m';
    const response = await supertest(app).get(`/api/${config.api.version}/users/${userId}/tests/${testId}`).set('Authorization', `bearer ${token}`);

    expect(response.body.error).toBe('Bad Request');
    expect(response.status).toBe(400);
    expect(response.body.message).toBe(`\"testId\" with value \"${testId}\" fails to match the required pattern: /^[0-9a-zA-Z_/-]{21}$/`);

    await app.close();
    await done();

  });

});

describe('Testing the DELETE [user/test] endpoint', () => {

  it('Should test the delete test endpoint with a pending result and return an error message', async (done) => {

    const userId = '5ec1c0336ac96a15145fe896';
    const testId = 'e5-l2QGl_R0ZHeonwp5fU';
    const deletedResponse = await supertest(app).delete(`/api/${config.api.version}/users/${userId}/tests/${testId}`).set('Authorization', `bearer ${token}`);

    expect(deletedResponse.body.error).toBe('Bad Request');
    expect(deletedResponse.status).toBe(400);
    expect(deletedResponse.body.message).toBe(messages.SSKB_ERROR_HAS_RESULTS_YET);

    await app.close();
    await done();
  });

  it('Should test the delete test endpoint and return a success message', async (done) => {

    const userId = '5ec1c0336ac96a15145fe896';
    const testId = '000000000000000000003';
    const deletedResponse = await supertest(app).delete(`/api/${config.api.version}/users/${userId}/tests/${testId}`).set('Authorization', `bearer ${token}`);

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

    const deletedResponse = await supertest(app).delete(`/api/${config.api.version}/users/${userId}/tests/${testId}`).set('Authorization', `bearer ${token}`);

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
      'templateId': '5e30b94546fc3f5c223c4254',
      'status': values[Math.floor(Math.random() * values.length)],
    };

    const response = await supertest(app)
      .put(`/api/${config.api.version}/users/${userId}/tests/${testId}`)
      .send(payload).set('Authorization', `bearer ${token}`);

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
      .send(payload).set('Authorization', `bearer ${token}`);

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
    const userId = '5ecb1beddf85c6885f986af5';
    const testId = 'PbLf_FRHxj3RXgZw_CiLO';
    const payload = {
      'results': [
        {
          'value': '0.3',
          'name': 'Urea',
          'min': '0.3',
          'max': '0.6',
          'unit': 'U',
        },
      ],
    };

    const response = await supertest(app)
      .put(`/api/${config.api.version}/users/${userId}/tests/${testId}/results`)
      .send(payload).set('Authorization', `bearer ${token}`);

    expect(response.error).toBe(false);
    expect(response.status).toBe(200);
    expect(response.body.message).toHaveProperty('matchedCount');
    expect(response.body.message.matchedCount).toBe(1);
    expect(response.body.message).toHaveProperty('updatedCount');
    expect(response.body.message.updatedCount).toBe(0);

    await app.close();
    await done();

  });

  it('Should test the update user/test/results endpoint and return a fail message advising that has been done ', async (done) => {
    const userId = '5ecb1beddf85c6885f986af5';
    const testId = 'qsOLPieVPnNNx7Gp4SpHa';
    const payload = {
      'results': [
        {
          'value': '0.3',
          'name': 'Urea',
          'min': '0.3',
          'max': '0.6',
          'unit': 'U',
        },
      ],
      'status': 'DONE',
    };

    const response = await supertest(app)
      .put(`/api/${config.api.version}/users/${userId}/tests/${testId}/results`)
      .send(payload).set('Authorization', `bearer ${token}`);

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Bad Request');
    expect(response.body.message).toBe(messages.SSKB_ERROR_RESULTS_HAS_DONE);

    await app.close();
    await done();
  });

  it('Should test the update user/test/results endpoint and return a fail message advising about empty payload ', async (done) => {
    const userId = '5ec1c0336ac96a15145fe896';
    const testId = 'e5-l2QGl_R0ZHeonwp5fU';
    const payload = {};

    const response = await supertest(app)
      .put(`/api/${config.api.version}/users/${userId}/tests/${testId}/results`)
      .send(payload).set('Authorization', `bearer ${token}`);

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Bad Request');
    expect(response.body.message).toBe('"results" is required');

    await app.close();
    await done();
  });
});

describe('Testing the GET [user/test/results] endpoint', () => {
  it('Should test the get user/test/results endpoint and return a success message', async (done) => {

    const userId = '5ec1c0336ac96a15145fe896';
    const testId = 'e5-l2QGl_R0ZHeonwp5fU';
    const response = await supertest(app).get(`/api/${config.api.version}/users/${userId}/tests/${testId}/results`).set('Authorization', `bearer ${token}`);

    expect(response.error).toBe(false);
    expect(response.status).toBe(200);
    expect(response.body.message).toHaveProperty('results');

    await app.close();
    await done();

  });

  it('Should test the get user/test/results endpoint with an incorrect testId and return a warning message', async (done) => {

    const userId = '5ec1c0336ac96a15145fe896';
    const testId = 'SqjEUEqZyh0BJbrP6H1m';
    const response = await supertest(app).get(`/api/${config.api.version}/users/${userId}/tests/${testId}`).set('Authorization', `bearer ${token}`);

    expect(response.body.error).toBe('Bad Request');
    expect(response.status).toBe(400);
    expect(response.body.message).toBe(`\"testId\" with value \"${testId}\" fails to match the required pattern: /^[0-9a-zA-Z_/-]{21}$/`);

    await app.close();
    await done();

  });

  it('Should test the get user/test/results endpoint with an incorrect userId and return a warning message', async (done) => {

    const userId = '5ec1c0336ac96a15145fe89';
    const testId = 'SqjEUEqZyh0BJbrP6H1mX';
    const response = await supertest(app).get(`/api/${config.api.version}/users/${userId}/tests/${testId}`).set('Authorization', `bearer ${token}`);

    expect(response.body.error).toBe('Bad Request');
    expect(response.status).toBe(400);
    expect(response.body.message).toBe(`\"userId\" with value \"${userId}\" fails to match the required pattern: /^[0-9a-fA-F]{24}$/`);

    await app.close();
    await done();

  });

  it('Should test the get user/test/results endpoint without results and return null', async (done) => {

    const userId = '111111111111111111111111';
    const testId = 'SqjEUEqZyh0BJbrP6H1mX';
    const response = await supertest(app).get(`/api/${config.api.version}/users/${userId}/tests/${testId}/results`).set('Authorization', `bearer ${token}`);

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

describe('Testing the POST [user/test/results/documents] endpoint', () => {

  it('Should test the get user/test/results/document endpoint and return a success message', async (done) => {

    const userId = '5ecf1d552dff15275a7d8d1c';
    const testIds = {
      'testsIds': [
        'CLdmNaU_1_gt-FzxqPNt1',
        'CLdmNaU_1_gt-FzxqPNtc',
      ],
    };
    const response = await supertest(app).post(`/api/${config.api.version}/users/${userId}/tests/results/document`).send(testIds).set('Authorization', `bearer ${token}`);

    expect(response.error).toBe(false);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty(['type']);

    await app.close();
    await done();

  });
});
