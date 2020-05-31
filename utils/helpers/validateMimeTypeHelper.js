
/**
   * Get MimeType from file and verify if it's a valid image mime type
   * @param mimeType
   * @returns {boolean}
   */
function validateImageMimeTypes(mimeType) {
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
   * Get MimeType from file and verify if it's valid file mime type
   * @param mimeType
   * @returns {boolean}
   */
function validateFileMimeTypes(mimeType) {
  this.validMimeTypes = [
    'text/csv',
  ];
  return this.validMimeTypes.includes(mimeType);
}

module.exports = {
  validateImageMimeTypes,
  validateFileMimeTypes,
};
