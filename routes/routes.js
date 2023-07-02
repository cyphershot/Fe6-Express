const routes = {
  prefix: '/api',
  version: '/v1',
  clientSignUp: '/client/signUp',
  clientLoginIn: '/client/login',
  adminSignUp: '/admin/signUp',
  adminLogIn: '/admin/login',
};

const getRouteByKey = routerKey => {
  return routes.prefix + routes[routerKey];
};

module.exports = { getRouteByKey };
