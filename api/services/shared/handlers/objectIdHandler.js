const { ObjectId } = require('mongodb');

/**
 * Function that receives and id and returns an object with Mongo's ObjectId
 *
 * @param {String} id
 * @returns Object
 */
function objectIdHandler(id) {
  return { _id: ObjectId(id) };
}

module.exports = objectIdHandler;
