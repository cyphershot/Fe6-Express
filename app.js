const express = require('express');
const cors = require('cors');
const routes = require('./routes/index');
const { establishDbConnection } = require('./mongo');
require('dotenv').config();
const User = require("./schemas/userSchema");
const router = require("./routes/router")

const PORT = process.env.PORT || 8080;

const app = express();



app.use(cors()); // Add this line to enable CORS

app.use(express.json());

app.use(router)

app.get("/",cors(),(req,res)=>{

})
// client side
const clientRoute = require("./clientside/clientSide")

routes.forEach(route => {
  app[route.method](route.path, route.handler);
});

establishDbConnection().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});