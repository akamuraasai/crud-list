const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const availableRoutes = stack => stack
  .reduce((routes, r) => (r.route && r.route.path ? [...routes, r.route.path] : routes), []);

const server = (port, defaultServer = express()) => {
  const app = defaultServer;

  return ({
    start: () => {
      // Base Middlewares
      app.use(cors());
      app.use(bodyParser.json());
      app.use(bodyParser.urlencoded({
        extended: true,
      }));

      // Root Route
      app.get('/', (req, res) => {
        // eslint-disable-next-line no-underscore-dangle
        res.send({ availableRoutes: availableRoutes(app._router.stack) });
      });

      app.listen(port, () => {
        // eslint-disable-next-line no-console
        console.log(`Service started at http://localhost:${port}`);
      });
    },
  });
}

module.exports = server;
