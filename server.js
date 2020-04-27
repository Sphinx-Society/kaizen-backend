const express = require('express');
const config = require('./config/index')
const app = express();

app.use(express.json());

app.get('/', (req, res, next) => {
  try {
    res.status(200)
      .send({
        "api":"Kaizen Backend",
        "version": "1.0.0",
        "git version": ""
      });

  } catch (error) {
    next(error);
  }
});

const server = app.listen(config.server.port, () => {
  console.log(`Server is listening at http://localhost:${server.address().port}`);
});
