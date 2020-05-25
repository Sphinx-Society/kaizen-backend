const generator = require('generate-password');
const bcrypt = require('bcrypt');

async function createPasswordHandler() {

  const password = generator.generate({
    length: 10,
    numbers: true,
    uppercase: true,
    lowercase: true,
    strict: true,
    excludeSimilarCharacters: true,
  });

  const hashedPassword = await bcrypt.hash(password, 10);

  const passwords = { password, hashedPassword };

  return passwords;
}

module.exports = createPasswordHandler;
