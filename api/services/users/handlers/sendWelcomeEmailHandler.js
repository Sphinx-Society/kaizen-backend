const Mailer = require('../../../../lib/mailing');

/**
 * Function that sends the welcome email with the user credentials.
 *
 * @param {*} content Object with username and password
 * @returns mailId
 */
async function sendWelcomeEmailHandler(content) {

  try {

    messageText = `Tus credenciales de acceso son:
    Usuario: ${content.credentials.username}
    Contraseña:  ${content.credentials.password}
    `;
    const message = {
      from: 'info@kaizen.com',
      to: content.email,
      subject: 'Bienvenido a Kaizen',
      text: messageText,
    };

    const mailId = await Mailer(message);

    return mailId;
  } catch (error) {
    return error;
  }
}

module.exports = sendWelcomeEmailHandler;
