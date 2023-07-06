const express = require('express');
const cors = require('cors');
const routes = require('./routes/index');
const { establishDbConnection } = require('./mongo');
require('dotenv').config();

const PORT = process.env.PORT || 8080;

const app = express();

app.use(cors()); // Add this line to enable CORS

app.use(express.json());

routes.forEach(route => {
  app[route.method](route.path, route.handler);
});

establishDbConnection().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});