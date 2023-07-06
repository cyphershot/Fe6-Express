const mongoose = require('mongoose');
require('dotenv').config();

let client;

const establishDbConnection = async () => {
  await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  client = mongoose.connection;
};

const getDbConnection = dbName => {
  return client.useDb(dbName);
};

module.exports = { establishDbConnection, getDbConnection }