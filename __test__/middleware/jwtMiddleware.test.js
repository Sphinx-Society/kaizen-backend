const express = require('express');
const supertest = require('supertest');
const jwtAuthMiddleware = require('../../middleware/jwtMiddleware');
const config = require('../../config');
const { userLoginMock } = require('../../utils/mocks/userLoginMock');
const server = require('../../server');

const app = express();
app.use(jwtAuthMiddleware);

describe('Testing validation JWT auth', () => {
  it('Should return unauthorized response and 401 status', async () => {
    const response = await supertest(app).get('/');
    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Unauthorized');
  });

  it('Should return unauthorized response and 200 status', async (done) => {
    const responseLogin = await supertest(server)
      .post(`/api/${config.api.version}/users/login`)
      .send(userLoginMock);
    const token = responseLogin.body.message.jwt;

    const response = await supertest(app)
      .get('/')
      .set('Authorization', `bearer ${token}`);

    expect(response.status).toBe(404);

    await server.close();
    await done();
  });
});
