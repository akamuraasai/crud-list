const { db, Sequelize } = require('../database');

const errorLog = err =>
  err && console.error('Error:', JSON.stringify(err, null, 2));

const List = db.define('list', {
  id: { type: Sequelize.INTEGER, primaryKey: true, allowNull: false, autoIncrement: true },
  name: { type: Sequelize.STRING, allowNull: false },
  userId: { type: Sequelize.INTEGER, allowNull: false },
  products: { type: Sequelize.STRING, allowNull: false },
});

module.exports = List;
