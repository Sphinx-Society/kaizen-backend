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
  jwt: {
    secret: process.env.AUTH_JWT_SECRET,
  },
  aws: {
    region: process.env.AWS_REGION,
    apiVersion: process.env.AWS_API_VERSION,
    bucket: process.env.AWS_BUCKET,
    accessKeyId: process.env.AWS_ACCESS_ID,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    acl: process.env.AWS_ACL,
  },
  notifications: {
    publicKey: process.env.PUSH_NOTIFICATIONS_PUBLIC,
    privateKey: process.env.PUSH_NOTIFICATIONS_PRIVATE,
  },
  sentry: {
    sentryDns: process.env.SENTRY_DNS,
    sentryId: process.env.SENTRY_ID,
  },
};
