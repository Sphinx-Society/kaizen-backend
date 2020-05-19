const express = require('express');
const supertest = require('supertest');
const jwtAuthMiddleware = require('../../middleware/jwtMiddleware');
const tokenMock = require('../../utils/mocks/tokenMock');

const app = express();
app.use(jwtAuthMiddleware);

describe('Testing validation JWT auth', () => {
  it('Should return unauthorized response and 401 status', async (done) => {
    const response = await supertest(app)
      .get('/');
    expect(response.status)
      .toBe(401);
    expect(response.body.message)
      .toBe('Unauthorized');
    done();
  });

  it('Should return unauthorized response and 200 status', async (done) => {
    const token = await tokenMock();
    const response = await supertest(app)
      .get('/')
      .set('Authorization', `bearer ${token}`);
    expect(response.status)
      .toBe(404);

    done();
  });
});
