
/**
 * Function that build the pagination object from the count of the existing documents.
 * It can receive a query that filters the count of documents.
 *
 * @param {*} page
 * @param {*} store
 * @param {*} table
 * @param {*} query
 * @returns promise to retrieve pagination object
 */
async function paginationHandler(page, store, table, query) {

  const noPage = parseInt(page, 10);
  const size = 3;
  const pagination = {};

  pagination.skip = size * (noPage - 1);
  pagination.limit = size;

  const count = await store.countDocuments(table, query);

  pagination.totalPages = Math.ceil(count / size);

  return pagination;
}

module.exports = paginationHandler;
