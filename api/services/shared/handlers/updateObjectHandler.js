
/**
 * Function that converts a nested object to a flat one.
 *
 * @param {*} res
 * @param {*} key
 * @param {*} val
 * @param {string} [pre='']
 * @returns Object
 */
function objectNestedToFlat(res, key, val, pre = '') {

  const prefix = [pre, key].filter((value) => value).join('.');
  return typeof val === 'object' ?
    Object.keys(val).reduce((prev, curr) => objectNestedToFlat(prev, curr, val[curr], prefix), res) :
    Object.assign(res, { [prefix]: val });

}

/**
 * Function that calls a function that converts a nested object to a flat one, and add the update date to the object.
 *
 * @param {*} data
 * @returns Object
 */
function updateObjectHandler(data) {

  const updateObject = Object.keys(data).reduce((prev, curr) => objectNestedToFlat(prev, curr, data[curr]), {});
  const updatedAt = Date.now();

  return { ...updateObject, updatedAt };
}

module.exports = updateObjectHandler;
