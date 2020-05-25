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
   * @param mimeType
   * @returns {boolean}
   */
  validateImageMimeTypes(mimeType) {
    this.validMimeTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/heic',
      'image/heif',
    ];
    return this.validMimeTypes.includes(mimeType);
  }

  /**
   * Receive a file to upload and username to use as key in Bucket
   *
   * @param { String } content
   * @param { String } username
   * @param { String } mimeType
   * @return Object with S3 information of file
   */
  uploadAvatar(content, username, mimeType) {
    if (!this.validateImageMimeTypes(mimeType)) throw new Error('This image is not support');
    const buffer = Buffer.from(content, 'base64');

    this.uploadParams = {
      Bucket: config.aws.bucket,
      Key: `${username}/avatar.${mimeType.split('/')[1]}`,
      Body: buffer,
      ACL: config.aws.acl,
    };

    return this._s3.upload(this.uploadParams)
      .promise()
      .then((data) => data);
  }
}

module.exports = AWS;
