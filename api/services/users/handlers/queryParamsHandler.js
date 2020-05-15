/**
 * Function that build the searchQuery object from the received parameters.
 *
 * @param {*} query
 * @returns searchQuery object
 */
function queryParamsHandler(query) {

  const { role = '', documentId = '' } = query;
  let searchQuery = { 'auth.active': true };

  if (documentId) {
    searchQuery = { ...searchQuery, 'profile.documentId': documentId };
  }

  switch (role) {
    case 'P':
      searchQuery = { ...searchQuery, 'auth.role': 'patient' };
      break;
    case 'L':
      searchQuery = { ...searchQuery, 'auth.role': 'lab' };
      break;
    case 'D':
      searchQuery = { ...searchQuery, 'auth.role': 'doctor' };
      break;
    case 'A':
      searchQuery = { ...searchQuery, 'auth.role': 'admin' };
      break;
    default:
      searchQuery = { ...searchQuery };
      break;
  }

  return searchQuery;
}

module.exports = queryParamsHandler;
