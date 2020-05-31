/**
 * Function that build the searchQuery object from the received parameters.
 *
 * @param {*} query
 * @returns searchQuery object
 */
function queryParamsHandler(query, userRole) {

  const { role = '', q = '' } = query;
  let searchQuery = { 'auth.active': true };

  if (q !== '') {
    searchQuery = { ...searchQuery, $text: { $search: q } };
  }

  if (userRole === 'admin') {
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
  }

  if (userRole === 'doctor' || userRole === 'lab') {
    searchQuery = { ...searchQuery, 'auth.role': 'patient' };
  }

  return searchQuery;
}

module.exports = queryParamsHandler;
