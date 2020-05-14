const generator = require('generate-password');
const Store = require('../../../../store/mongo');

const store = new Store();

/**
 * Function that creates the username from the name, surname and last four digits of the document id,
 * then check if the user already exists in database, and create another with four random digits.
 *
 * @param {*} firstName
 * @param {*} lastName
 * @param {*} documentId
 * @returns String username
 */
async function generateUser(firstName, lastName, documentId) {

  try {
    const userPart1 = firstName.trim().toLowerCase().split(' ')[0];
    const userPart2 = lastName.trim().toLowerCase().split(' ')[0];
    let userPart3 = documentId.slice(-4);

    const username = `${userPart1}.${userPart2}.${userPart3}`;

    const query = { 'auth.username': username };
    const searchCount = await store.findAndCount('users', query);

    if (searchCount > 0) {
      userPart3 = 1000 + Math.floor(Math.random() * 9000).toString();
      return generateUser(firstName, lastName, userPart3);
    }

    return username;

  } catch (error) {
    return error;
  }

}

/**
 * Function that call generateUser function to create a username with user's information
 * and create an random password.
 *
 * @param {*} user
 * @returns Object { username, password }
 */
async function createCredentialsHandler(user) {

  if (!user) {
    return null;
  }

  try {
    const { firstName, lastName, documentId } = user.profile;

    const username = await generateUser(firstName, lastName, documentId);

    const password = generator.generate({
      length: 10,
      numbers: true,
      uppercase: true,
      lowercase: true,
      strict: true,
      excludeSimilarCharacters: true,
    });

    const userCredentials = { username, password };

    return userCredentials;

  } catch (error) {
    return error;
  }
}

module.exports = createCredentialsHandler;

