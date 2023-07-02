const { clientSignUpRoute } = require('../controllers/client/clientSignUpRoute');
const { clientLoginRoute } = require('../controllers/client/clientLoginRoute');
const { adminSignUpRoute } = require('../controllers/admin/adminSignUpRoute');
const { adminLoginRoute } = require('../controllers/admin/adminLoginRoute');

const routes = [clientSignUpRoute, clientLoginRoute, adminSignUpRoute, adminLoginRoute];

module.exports = routes;
