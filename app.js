const express = require('express');
const routes = require('./routes/index');
const { establishDbConnection } = require('./mongo');
require('dotenv').config();

const PORT = process.env.PORT || 8080;

const app = express();

app.use(express.json());

routes.forEach(route => {
  app[route.method](route.path, route.handler);
});

establishDbConnection().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});

// const collection = require('./mongo');
// const cors = require('cors');
// const app = express();
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(cors());
// const User = require('./schemas/userSchema');
// const router = require('./routes/router');

// app.use(router);

// app.get('/', cors(), (req, res) => {});
// // client side
// const clientRoute = require('./clientside/clientSide');

// app.use('/', clientRoute);
// app.use('/signup', clientRoute);

// // admin side
// const adminRoute = require('./adminSide/adminSide');
// app.use('/adminlogin', adminRoute);
// app.use('/adminsignup', adminRoute);

// app.listen(8000, () => {
//   console.log('port connected');
// });
