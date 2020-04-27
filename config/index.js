const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  server: {
    port: process.env.PORT
  }
}
