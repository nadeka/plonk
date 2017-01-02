'use strict';

const Hapi = require('hapi');
const jwt = require('jwt-simple');
const jwtSecret = require('./config/settings').jwtSecret;
const authController = require('./controllers/auth');
const Nes = require('nes');

const server = new Hapi.Server();

server.connection({
  host: '0.0.0.0',
  port: process.env.PORT || 6001,
  routes: {
    cors: true
  }
});

server.register(require('hapi-auth-jwt'), function (err) {
  server.auth.strategy('token', 'jwt', {
    key: jwtSecret,
    validateFunc: authController.validate,
    verifyOptions: { algorithms: [ 'HS256' ] }
  });

  server.register(
    {
      register: Nes,
      options: {
        auth: {
          route: 'token'
        },
      }
    },
    function (err) {
      const routes = require('./routes');

      server.route(routes);

      server.start((err) => {
        if (err) {
          throw err;
        }

        console.log(`Server running at: ${server.info.uri}`);
      });
    }
  );
});

module.exports = server;
