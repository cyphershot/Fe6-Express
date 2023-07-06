const { clientSignUpRoute } = require('../controllers/client/clientSignUpRoute');
const { clientLoginRoute } = require('../controllers/client/clientLoginRoute');
const { adminSignUpRoute } = require('../controllers/admin/adminSignUpRoute');
const { adminLoginRoute } = require('../controllers/admin/adminLoginRoute');
const {mailRoute} = require('../controllers/client/clientSignUpRoute');


const routes = [clientSignUpRoute, clientLoginRoute, adminSignUpRoute, adminLoginRoute,mailRoute];

module.exports = routes;