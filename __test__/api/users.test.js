const supertest = require('supertest');
const app = require('../../server');
const config = require('../../config');
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

describe('Testing the users API', () => {

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

  it('Should test the post users endpoint and return a success message', async (done) => {

    const response = await supertest(app).post(`/api/${config.api.version}/users`).send(createUserSuccess);

    expect(response.status).toBe(201);
    expect(response.error).toBe(false);
    expect(response.body.message.insertedId).toHaveLength(24);
    expect(response.body.message.insertedCount).toBe(1);

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

  it('Should test the get users endpoint and return a success message', async (done) => {

    const response = await supertest(app).get(`/api/${config.api.version}/users`);

    expect(response.status).toBe(200);
    expect(response.error).toBe(false);

    await app.close();
    await done();

  });
});
