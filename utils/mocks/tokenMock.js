const jwt = require('jsonwebtoken');
const config = require('../../config');
const MongoLib = require('../../store/mongo');
const { userLoginMock } = require('./userLoginMock');

module.exports = async function () {
  const store = new MongoLib();
  const collection = 'users';
  const query = {
    'auth.username': userLoginMock.username,
  };

  const [user] = await store.search(collection, query);

  const payload = {
    firstName: user.profile.firstName,
    lastName: user.profile.lastName,
    documentId: user.profile.documentId,
    email: user.auth.email,
    role: user.auth.role,
    username: user.auth.username,
    active: user.auth.active,
  };

  store.client.close();

  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: '1d',
  });
};
