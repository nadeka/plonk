'use strict';

const Hapi = require('hapi');
const jwt = require('jwt-simple');
const authController = require('./controllers/auth');
const Nes = require('nes');
const settings = require('./config/settings');

const server = new Hapi.Server();

server.connection({
  host: '0.0.0.0',
  port: process.env.PORT || 6001,
  routes: {
    cors: {
      credentials: true
    }
  }
});

const nesConfig = {
  register: Nes,
  auth: {
    route: 'session'
  }
};

server.register([require('hapi-auth-cookie'), nesConfig], function (err) {
    if (err) {
      throw err;
    }

    server.auth.strategy('session', 'cookie', {
      cookie: 'accessToken',
      password: settings.cookiePassword,
      validateFunc: authController.validate,
      redirectTo: false,
      clearInvalid: true,
      domain: '.exoenzy.me',
      isSecure: settings.environment !== 'development',

      // TODO find a way to make hapi-auth-cookie work with Nes without client manually sending cookie..
      isHttpOnly: false
    });

    const routes = require('./routes');

    server.route(routes);

    server.subscription('/new-message');
    server.subscription('/new-channel');
    server.subscription('/user-joined');

    server.start((err) => {
      if (err) {
        throw err;
      }

      console.log(`Server running at: ${server.info.uri}`);
    });
});

module.exports = {
  server
};
