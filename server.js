const express = require('express');
const session = require('express-session');
const cors = require('cors');
const path = require('path');
const Routes = require('./api/routes');
const config = require('./config/index');
const notFoundMiddleware = require('./middleware/notFoundMiddleware');
const {
  logErrors,
  wrapErrors,
  errorMiddleware,
} = require('./middleware/errorMiddleware.js');

const app = express();

app.use(express.json());

app.use(cors());

app.use(session({
  secret: config.server.sessionKey,
  resave: true,
  saveUninitialized: true,
}));

Routes(app);

app.use('/webclient', express.static(path.join(__dirname, 'public')));

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

app.use(notFoundMiddleware);

app.use(wrapErrors);
app.use(logErrors);
app.use(errorMiddleware);

if (config.server.env === 'testing') {
  config.server.port = Math.abs(parseInt((Math.random() * (3000 - 9000) - 3000), 10));
}

const server = app.listen(config.server.port, () => {
  console.log(`Server is listening at ${config.server.host}:${server.address().port}`);
});

module.exports = server;
