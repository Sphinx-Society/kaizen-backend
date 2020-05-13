const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  server: {
    host: process.env.HOST,
    env: process.env.ENV,
    port: process.env.PORT,
    sessionKey: process.env.SESSION_KEY,
  },
  api: {
    version: process.env.API_VERSION,
  },
  mongo: {
    host: process.env.MONGO_HOST,
    user: process.env.MONGO_USER,
    password: process.env.MONGO_PASS,
    database: process.env.MONGO_DB,
    mongo_uri: `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_HOST}/${process.env.MONGO_DB}?retryWrites=true&w=majority`,
  },
  email: {
    user: process.env.EMAIL_USER,
    password: process.env.EMAIL_PASSWORD,
    service: process.env.EMAIL_SERVICE,
  },
};
