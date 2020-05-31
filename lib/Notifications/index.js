const webpush = require('web-push');

const config = require('../../config');

webpush.setVapidDetails(
  `mailto:${config.email.user}`,
  config.notifications.publicKey,
  config.notifications.privateKey,
);

module.exports = webpush;
