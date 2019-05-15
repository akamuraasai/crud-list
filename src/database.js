const Sequelize = require('sequelize');
const { database, user, password, opts } = require('../config/database');

const db = new Sequelize(
  database,
  user,
  password,
  opts,
);

module.exports = {
  db,
  Sequelize,
};
