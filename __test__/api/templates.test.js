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

const {
  updateTemplateSuccess,
  updateTemplateTypeError,
  updateTemplateForbiddenPropertyError,
} = require('../../utils/mocks/updateTemplateMock');

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

describe('Testing the PUT [templates] endpoint', () => {

  it('Should test the update templates endpoint with a type error and return an error message', async (done) => {

    const response = await supertest(app).post(`/api/${config.api.version}/templates`).send(createTemplateSuccess);

    expect(response.error).toBe(false);
    expect(response.status).toBe(201);
    expect(response.body.message.insertedId).toHaveLength(24);
    expect(response.body.message.insertedCount).toBe(1);

    const updatedResponse = await supertest(app).put(`/api/${config.api.version}/templates/${response.body.message.insertedId}`).send(updateTemplateTypeError);

    expect(updatedResponse.body.error).toBe('Bad Request');
    expect(updatedResponse.status).toBe(400);
    expect(updatedResponse.body.message).toBe('"Field type" must be one of [string, number, select, text, file]');

    const deletedResponse = await store.delete('templates', response.body.message.insertedId);

    expect(deletedResponse.deletedId).toHaveLength(24);
    expect(deletedResponse.deletedCount).toBe(1);

    await app.close();
    await done();
  });

  it('Should test the update templates endpoint and return a success message', async (done) => {

    const response = await supertest(app).post(`/api/${config.api.version}/templates`).send(createTemplateSuccess);

    expect(response.error).toBe(false);
    expect(response.status).toBe(201);
    expect(response.body.message.insertedId).toHaveLength(24);
    expect(response.body.message.insertedCount).toBe(1);

    const updatedResponse = await supertest(app).put(`/api/${config.api.version}/templates/${response.body.message.insertedId}`).send(updateTemplateSuccess);

    expect(updatedResponse.error).toBe(false);
    expect(updatedResponse.status).toBe(200);
    expect(updatedResponse.body.message.matchedCount).toBe(1);
    expect(updatedResponse.body.message.updatedCount).toBe(1);

    const deletedResponse = await store.delete('templates', response.body.message.insertedId);

    expect(deletedResponse.deletedId).toHaveLength(24);
    expect(deletedResponse.deletedCount).toBe(1);

    await app.close();
    await done();
  });

  it('Should test the update templates endpoint with a forbidden property and return an error message', async (done) => {

    const response = await supertest(app).post(`/api/${config.api.version}/templates`).send(createTemplateSuccess);

    expect(response.error).toBe(false);
    expect(response.status).toBe(201);
    expect(response.body.message.insertedId).toHaveLength(24);
    expect(response.body.message.insertedCount).toBe(1);

    const updatedResponse = await supertest(app).put(`/api/${config.api.version}/templates/${response.body.message.insertedId}`).send(updateTemplateForbiddenPropertyError);

    expect(updatedResponse.body.error).toBe('Bad Request');
    expect(updatedResponse.status).toBe(400);
    expect(updatedResponse.body.message).toBe('\"fields[0].other\" is not allowed');

    const deletedResponse = await store.delete('templates', response.body.message.insertedId);

    expect(deletedResponse.deletedId).toHaveLength(24);
    expect(deletedResponse.deletedCount).toBe(1);

    await app.close();
    await done();
  });
});

describe('Testing the DELETE [templates] endpoint', () => {
  it('Should test the delete template endpoint and return a success message', async (done) => {

    const response = await supertest(app).post(`/api/${config.api.version}/templates`).send(createTemplateSuccess);

    expect(response.error).toBe(false);
    expect(response.status).toBe(201);
    expect(response.body.message.insertedId).toHaveLength(24);
    expect(response.body.message.insertedCount).toBe(1);

    const deletedResponse = await supertest(app).delete(`/api/${config.api.version}/templates/${response.body.message.insertedId}`);

    expect(deletedResponse.error).toBe(false);
    expect(deletedResponse.status).toBe(200);
    expect(deletedResponse.body.message.matchedCount).toBe(1);
    expect(deletedResponse.body.message.updatedCount).toBe(1);

    const deleteTemplate = await store.delete('templates', response.body.message.insertedId);

    expect(deleteTemplate.deletedId).toHaveLength(24);
    expect(deleteTemplate.deletedCount).toBe(1);

    await app.close();
    await done();
  });

  it('Should test the delete template endpoint with an inexistent template and return a success message', async (done) => {

    const templateId = '000000000000000000000001';
    const deletedResponse = await supertest(app).delete(`/api/${config.api.version}/templates/${templateId}`);

    expect(deletedResponse.error).toBe(false);
    expect(deletedResponse.status).toBe(200);
    expect(deletedResponse.body.message.matchedCount).toBe(0);
    expect(deletedResponse.body.message.updatedCount).toBe(0);

    await app.close();
    await done();
  });
});

describe('Testing the GET [templates/id] endpoint', () => {
  it('Should test the get templates by id endpoint and return a success message', async (done) => {
    const templateId = '5ec9fee83c8300347e2a670f';
    const response = await supertest(app).get(`/api/${config.api.version}/templates/${templateId}`);
    expect(response.error).toBe(false);
    expect(response.status).toBe(200);
    expect(response.body.message[0]._id).toBe(templateId);
    expect(response.body.message[0].active).toBe(true);
    await app.close();
    await done();
  });

  it('Should test the get templates by id endpoint and return an error message', async (done) => {
    const templateId = '5ec9fee83c83003';
    const response = await supertest(app).get(`/api/${config.api.version}/templates/${templateId}`);

    expect(response.body.error).toBe('Bad Request');
    expect(response.badRequest).toBe(true);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('"templateId" with value "5ec9fee83c83003" fails to match the required pattern: /^[0-9a-fA-F]{24}$/');
    await app.close();
    await done();
  });

  it('Should test the get templates by id endpoint and returns an empty object inside the "message" property', async (done) => {
    const templateId = '5ecb30518904d04999e27ebc';
    const response = await supertest(app).get(`/api/${config.api.version}/templates/${templateId}`);

    expect(response.body.error).toBe(false);
    expect(response.badRequest).toBe(false);
    expect(response.status).toBe(200);
    expect(response.body.message).toStrictEqual([]);
    await app.close();
    await done();
  });
});
