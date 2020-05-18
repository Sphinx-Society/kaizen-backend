function projectionHandler(property, filter) {

  const projection = {};

  if (property === 'tests' && filter.status !== undefined) {
    projection[property] = { $elemMatch: { 'status': filter.status === 'P' ? 'PENDING' : 'DONE' } };
  } else {
    projection[property] = 1;
  }

  return projection;
}

module.exports = projectionHandler;
