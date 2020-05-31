const morgan = require('morgan');

morgan.token('body', (req) => {
  return `Body: ${JSON.stringify(req.body)}`;
});
morgan.token('params', (req) => {
  return `Params: ${JSON.stringify(req.params)}`;
});
morgan.token('query', (req) => {
  return `Query: ${JSON.stringify(req.query)}`;
});

module.exports = morgan;
