const express = require('express');
const session = require('express-session');
const Routes = require('./api/routes');
const config = require('./config/index');
const notFoundHandler = require('./middleware/notFoundHandler');
const {
  logErrors,
  wrapErrors,
  errorHandler,
} = require('./middleware/errorHandlers.js');

const app = express();

app.use(express.json());

app.use(session({
  secret: config.server.sessionKey,
  resave: true,
  saveUninitialized: true,
}));

Routes(app);

app.get('/', (req, res, next) => {
  try {
    res.status(200)
      .send({
        'api': 'Kaizen Backend',
        'version': '1.0.0',
        'git version': '',
      });

  } catch (error) {
    next(error);
  }
});

app.use(notFoundHandler);

app.use(wrapErrors);
app.use(logErrors);
app.use(errorHandler);

const server = app.listen(config.server.port, () => {
  console.log(`Server is listening at ${config.server.host}:${server.address().port}`);
});
