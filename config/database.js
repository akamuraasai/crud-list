module.exports = {
  database: process.env.DATABASE,
  user: process.env.USER,
  password: process.env.PASSWORD,
  opts: {
    host: process.env.HOST,
    dialect: process.env.DIALECT || 'mysql',
    logging: process.env.LOG ? console.log : null,

    pool: {
      max: 2,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    // http://docs.sequelizejs.com/manual/tutorial/querying.html#operators
    operatorsAliases: false
  }
};
