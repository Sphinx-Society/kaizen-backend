/**
 * Function that build a projection query depending on the type of property and filter.
 *
 * @param {*} property
 * @param {*} filter
 * @returns Object
 */
function projectionHandler(property, filter) {

  const projection = {};

  if (property === 'tests' && filter.status !== undefined) {
    projection[property] = { $elemMatch: { 'status': filter.status === 'P' ? 'PENDING' : 'DONE' } };
  } else if (property === 'test' && filter.testId !== undefined) {
    projection[property] = { $elemMatch: { 'testId': filter.testId } };
  } else {
    projection[property] = 1;
  }

  return projection;
}

module.exports = projectionHandler;
