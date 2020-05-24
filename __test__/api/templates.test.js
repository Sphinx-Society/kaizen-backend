const supertest = require('supertest');
const app = require('../../server');
const config = require('../../config');
const MongoLib = require('../../store/mongo');
const {
  createTemplateSuccess,
  createTemplateNameError,
  createTemplateTypeError,
  createTemplateCreatedByError,
  createTemplateFieldsEmptyError,
  createTemplateFieldIdError,
  createTemplateFieldNameError,
  createTemplateFieldTypeError,
  createFieldMinimumLimitError,
} = require('../../utils/mocks/createTemplateMock');

const store = new MongoLib();

describe('Testing the POST [templates] endpoint', () => {

  it('Should test the post templates endpoint and return a success message', async (done) => {

    const response = await supertest(app).post(`/api/${config.api.version}/templates`).send(createTemplateSuccess);

    expect(response.error).toBe(false);
    expect(response.status).toBe(201);
    expect(response.body.message.insertedId).toHaveLength(24);
    expect(response.body.message.insertedCount).toBe(1);

    const deletedResponse = await store.delete('templates', response.body.message.insertedId);

    expect(deletedResponse.deletedId).toHaveLength(24);
    expect(deletedResponse.deletedCount).toBe(1);

    await app.close();
    await done();
  });

  it('Should test the post templates endpoint with a duplicated name and return a success message', async (done) => {

    const responseDuplicated = await supertest(app).post(`/api/${config.api.version}/templates`).send(createTemplateSuccess);

    expect(responseDuplicated.error).toBe(false);
    expect(responseDuplicated.status).toBe(201);
    expect(responseDuplicated.body.message).toBe('Template already exists');

    await store.update('catalogs', {}, null, null, { 'medicalTests': createTemplateSuccess.name });

    await app.close();
    await done();
  });

  it('Should test the post templates endpoint with a template name error and return an error message', async (done) => {

    const response = await supertest(app).post(`/api/${config.api.version}/templates`).send(createTemplateNameError);

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Bad Request');
    expect(response.body.message).toBe('\"Template name\" is required');

    await app.close();
    await done();
  });

  it('Should test the post templates endpoint with a template type error and return an error message', async (done) => {

    const response = await supertest(app).post(`/api/${config.api.version}/templates`).send(createTemplateTypeError);

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Bad Request');
    expect(response.body.message).toBe('\"Template type\" is required');

    await app.close();
    await done();
  });

  it('Should test the post templates endpoint with a template Created By error and return an error message', async (done) => {

    const response = await supertest(app).post(`/api/${config.api.version}/templates`).send(createTemplateCreatedByError);

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Bad Request');
    expect(response.body.message).toBe('\"Created by\" is required');

    await app.close();
    await done();
  });

  it('Should test the post templates endpoint with a template fields empty error and return an error message', async (done) => {

    const response = await supertest(app).post(`/api/${config.api.version}/templates`).send(createTemplateFieldsEmptyError);

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Bad Request');
    expect(response.body.message).toBe('\"fields\" does not contain 1 required value(s)');

    await app.close();
    await done();
  });

  it('Should test the post templates endpoint with a template field id error and return an error message', async (done) => {

    const response = await supertest(app).post(`/api/${config.api.version}/templates`).send(createTemplateFieldIdError);

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Bad Request');
    expect(response.body.message).toBe('\"Field id\" is required');

    await app.close();
    await done();
  });

  it('Should test the post templates endpoint with a template field name error and return an error message', async (done) => {

    const response = await supertest(app).post(`/api/${config.api.version}/templates`).send(createTemplateFieldNameError);

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Bad Request');
    expect(response.body.message).toBe('\"Field name\" is required');

    await app.close();
    await done();
  });

  it('Should test the post templates endpoint with a template field type error and return an error message', async (done) => {

    const response = await supertest(app).post(`/api/${config.api.version}/templates`).send(createTemplateFieldTypeError);

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Bad Request');
    expect(response.body.message).toBe('\"Field type\" is required');

    await app.close();
    await done();
  });

  it('Should test the post templates endpoint with a template field type error and return an error message', async (done) => {

    const response = await supertest(app).post(`/api/${config.api.version}/templates`).send(createTemplateFieldTypeError);

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Bad Request');
    expect(response.body.message).toBe('\"Field type\" is required');

    await app.close();
    await done();
  });

  it('Should test the post templates endpoint with a template field minimum error and return an error message', async (done) => {

    const response = await supertest(app).post(`/api/${config.api.version}/templates`).send(createFieldMinimumLimitError);

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Bad Request');
    expect(response.body.message).toBe('\"Field minimum limit\" must be a number');

    await app.close();
    await done();
  });

});
