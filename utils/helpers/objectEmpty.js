/**
 * Function that validates if an object is empty.
 *
 * @param Object obj
 * @returns Boolean
 */
function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}

module.exports = isEmpty;
