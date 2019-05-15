require('dotenv').config();
const server = require('./src/server');

const port = process.env.PORT || 8080;

const app = server(port);

app.start();
