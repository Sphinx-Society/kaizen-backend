const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../../../../config');

module.exports = async function (user, store, collection) {

  const query = { 'auth.username': user.username };
  const [userFromMongo] = await store.search(collection, query);

  if (!(await bcrypt.compare(user.password, userFromMongo.auth.password))) {
    throw new Error('Username or password is incorrect');
  }

  delete user.password;

  const payload = {
    firstName: userFromMongo.profile.firstName,
    lastName: userFromMongo.profile.lastName,
    documentId: userFromMongo.profile.documentId,
    email: userFromMongo.auth.email,
    role: userFromMongo.auth.role,
    username: userFromMongo.auth.username,
    active: userFromMongo.auth.active,
  };

  const token = jwt.sign(payload, config.jwt.secret, {
    expiresIn: '1d',
  });

  return {
    jwt: token,
  };
};
