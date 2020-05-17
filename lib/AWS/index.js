const aws = require('aws-sdk');
const config = require('../../config');

/**
 * Class AWS
 * To manage all actions that we might need
 * to use Amazon S3
 */
class AWS {
  constructor() {
    this._s3 = new aws.S3({
      accessKeyId: config.aws.accessKeyId,
      secretAccessKey: config.aws.secretAccessKey,
      Bucket: config.aws.bucket,
    });
  }

  /**
   * Get MimeType from file and verify if it's valid
   * @param file
   * @returns {boolean}
   */
  validateImageMimeTypes(file) {
    this.validMimeTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/heic',
      'image/heif',
    ];
    return this.validMimeTypes.includes(file.mimetype);
  }

  /**
   * Receive a file to upload and username to use as key in Bucket
   *
   * @param file
   * @param username
   * @return Object with S3 information of file
   */
  uploadFile(file, username) {
    if (!this.validateImageMimeTypes(file)) throw new Error('This image is not support');

    this.uploadParams = {
      Bucket: config.aws.bucket,
      Key: `${username}/${file.originalname}`,
      Body: file.buffer,
      ACL: config.aws.acl,
    };

    this._s3.upload(this.uploadParams, (err, data) => {
      if (err) {
        throw new Error(err.message);
      }
      if (data) {
        return data;
      }
    });
  }
}

module.exports = AWS;
