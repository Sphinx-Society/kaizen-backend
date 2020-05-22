const { isEmpty } = require('../../../../utils/helpers/objectHelper');

/**
 * Function that build a projection query depending on the type of property and filter.
 *
 * @param Object property
 * @param Object filter
 * @returns Object projection
 */
function projectionHandler(property, filter = {}) {

  let projection = {};

  if (property === 'tests') {

    let condition = {};
    if (isEmpty(filter)) {
      condition = { $or: [{ $eq: ['$$tests.status', 'PENDING'] }, { $eq: ['$$tests.status', 'DONE'] }] };
    } else if (filter.status.toUpperCase() === 'P') {
      condition = {
        '$eq': [
          '$$tests.status', 'PENDING',
        ],
      };
    } else if (filter.status.toUpperCase() === 'D') {
      condition = {
        '$eq': [
          '$$tests.status', 'DONE',
        ],
      };
    }

    projection = {
      '$project': {
        '_id': 0,
        'tests': {
          '$filter': {
            'input': '$tests',
            'as': 'tests',
            'cond': condition,
          },
        },
      },
    };

  } else if (property === 'test' && filter.testId !== undefined) {
    projection[property] = { $elemMatch: { 'testId': filter.testId } };
  } else {
    projection[property] = 1;
  }

  return projection;
}

module.exports = projectionHandler;
