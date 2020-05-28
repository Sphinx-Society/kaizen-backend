const bcrypt = require('bcrypt');

/**
 * Function that receives the user information and auth credentials and return the user object
 * adding the auth nested object with the password encrypted.
 *
 * @param {*} user
 * @param {*} credentials
 * @returns
 */
async function createUserHandler(user, credentials, createdBy) {

  if (!user || !credentials) {
    return null;
  }

  const { username } = credentials;
  let { password } = credentials;
  const insertedAt = Date.now();
  const active = true;
  const isConfirmed = false;

  const hashedPassword = await bcrypt.hash(password, 10);

  createdUser = {
    ...user,
    auth: {
      ...user.auth,
      username,
      password: hashedPassword,
      active,
      isConfirmed,
    },
    tests: [],
    insertedAt,
    createdBy,
  };

  password = null;
  return createdUser;

}

module.exports = createUserHandler;

