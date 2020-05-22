const { isEmpty } = require('../../../../utils/helpers/objectHelper');

/**
 * Function that builds the test results projection query.
 *
 * @param {String} userId
 * @param {String} testId
 * @returns Array results projection
 */
function getTestResultsProjection(userId, testId) {

  const projection = [
    { '$match': userId },
    {
      '$unwind': {
        'path': '$tests',
      },
    },
    {
      '$match': {
        'tests.testId': testId,
      },
    }, {
      '$project': {
        '_id': 0,
        'tests': {
          'testId': 1,
          'results': 1,
        },
      },
    }, {
      '$group': {
        '_id': {
          'results': '$tests.results',
        },
      },
    }];

  return projection;
}

/**
 * Function that builds the tests filter projection query.
 *
 * @param {Object} filter
 * @returns Object tests filter projection
 */
function getTestsFilterProjection(filter) {

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

  return {
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
}

/**
 * Function that build a projection query depending on the type of property and filter.
 *
 *
 * @param Object property
 * @param Object filter
 * @returns Object projection
 */
function projectionHandler(property, filter = {}) {

  let projection = {};

  if (property === 'tests' && filter.testId !== undefined) {

    projection[property] = { $elemMatch: { 'testId': filter.testId } };

  } else if (property === 'tests') {

    projection = getTestsFilterProjection(filter);

  } else if (property === 'results') {

    projection = getTestResultsProjection(filter.id, filter.testId);

  } else {
    projection[property] = 1;
  }

  return projection;
}

module.exports = projectionHandler;
