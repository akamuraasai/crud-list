const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { db } = require('./database');
const lists = require('./Routes/lists');

const availableRoutes = stack => stack
  .reduce((routes, r) => (r.route && r.route.path ? [...routes, r.route.path] : routes), []);

const server = (port, defaultServer = express()) => {
  const app = defaultServer;
  const listRoutes = lists(express.Router());

  return ({
    start: async () => {
      // Sync Database
      await db.sync();

      // Base Middlewares
      app.use(cors());
      app.use(bodyParser.json());
      app.use(bodyParser.urlencoded({
        extended: true,
      }));

      // Custom Routes
      app.use('/', listRoutes);

      // Root Route
      app.get('/', (req, res) => {
        // eslint-disable-next-line no-underscore-dangle
        res.send({ availableRoutes: availableRoutes([...app._router.stack, ...listRoutes.stack]) });
      });

      app.listen(port, () => {
        // eslint-disable-next-line no-console
        console.log(`Service started at http://localhost:${port}`);
      });
    },
  });
}

module.exports = server;
