const winston = require('winston');
const appRoot = require('app-root-path');
const createIfNotExist = require('create-if-not-exist');

/**
 *  Transform unix date to UTC format string
 * @returns {string}
 */
dateFormat = () => {
  return new Date(Date.now()).toUTCString();
};

class LoggerService {
  constructor() {
    this.route = `${appRoot}/logs/kaizen.log`;
    createIfNotExist(this.route, '');
    this.logger = winston.createLogger({
      transports: [
        new winston.transports.File({
          filename: this.route,
        }),
      ],
      format: winston.format.printf((info) => {
        let message = `{"date": "${dateFormat()}", "level": "${info.level.toUpperCase()}", "message": "${info.message.trim()}"`;
        message = info.obj ? `${message}, "data": ${JSON.stringify(info.obj)}}` : message;
        return message;
      }),
    });
  }

  /**
   * Set data information in data log property
   * @param logData
   */
  setLogData(logData) {
    this.log_data = logData;
  }

  /**
   * Log a message just for information
   * @param message
   * @param obj
   * @returns {Promise<void>}
   */
  async info(message, obj = {}) {
    this.logger.log('info', message, {
      obj,
    });
  }

  /**
   * Log a message in debug mode
   * @param message
   * @param obj
   * @returns {Promise<void>}
   */
  async debug(message, obj = {}) {
    this.logger.log('debug', message, {
      obj,
    });
  }

  /**
   * Log a message when error has occurred
   * @param message
   * @param obj
   * @returns {Promise<void>}
   */
  async error(message, obj = {}) {
    this.logger.log('error', message, {
      obj,
    });
  }
}

module.exports = LoggerService;
