const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const boom = require('@hapi/boom');
const config = require('../../../../config');

module.exports = async function (user, store, collection) {

  const query = { 'auth.username': user.username };
  const [userFromMongo] = await store.search(collection, query);
  const [permissions] = await store.search('permissions', {});
  if (!(await bcrypt.compare(user.password, userFromMongo.auth.password))) {
    throw new Error(messages.SSKB_ERROR_USER_PSWD_INCORRECT);
  }

  if (userFromMongo.auth.active === false) {
    throw (boom.unauthorized(message.SSKB_ERROR_USER_INACTIVE));
  }

  delete user.password;

  const payload = {
    userId: userFromMongo._id,
    firstName: userFromMongo.profile.firstName,
    lastName: userFromMongo.profile.lastName,
    documentId: userFromMongo.profile.documentId,
    email: userFromMongo.auth.email,
    role: userFromMongo.auth.role,
    username: userFromMongo.auth.username,
    active: userFromMongo.auth.active,
    permission: permissions[userFromMongo.auth.role] || [],
  };

  const token = jwt.sign(payload, config.jwt.secret, {
    expiresIn: '1d',
  });

  return {
    jwt: token,
    id: userFromMongo._id,
    swKey: config.notifications.publicKey,
  };
};
