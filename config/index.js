const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  server: {
    port: process.env.PORT,
  },
  mongo: {
    host: process.env.MONGO_HOST,
    user: process.env.MONGO_USER,
    password: process.env.MONGO_PASS,
    database: process.env.MONGO_DB,
  },
};
