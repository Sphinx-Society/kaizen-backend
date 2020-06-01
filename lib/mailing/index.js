const nodemailer = require('nodemailer');
const config = require('../../config');

/**
 *Function that sends an email. It need the email service auth information and the content information to work.
 *
 * @param {*} { from = '', to = '', subject = '', text = '', html = '' }
 * @returns String messageId
 */
function Mailer({ from, to, subject, text, html }) {

  try {

    const transporter = nodemailer.createTransport({
      service: config.email.service,
      auth: {
        user: config.email.user,
        pass: config.email.password,
      },
    });

    const message = {
      from,
      to,
      subject,
      text,
      html,
    };

    return new Promise((resolve, reject) => {
      transporter.sendMail(message, (err, info) => {
        if (err) {
          reject(err);
          return (err);
        }
        resolve(info.messageId);
        return info.messageId;
      });
    });
  } catch (error) {
    throw new Error(error);

  }
}

module.exports = Mailer;
