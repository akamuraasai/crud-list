module.exports = {
  database: process.env.DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  opts: {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT || 'mysql',
    logging: process.env.DB_LOG ? console.log : null,

    pool: {
      max: 2,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
  }
};
