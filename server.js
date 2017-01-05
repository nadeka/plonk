'use strict';

const Hapi = require('hapi');
const HapiAuthCookie = require('hapi-auth-cookie');
const Disinfect = require('disinfect');
const Nes = require('nes');

const authController = require('./controllers/auth');
const settings = require('./config/settings');

const server = new Hapi.Server();

server.connection({
  host: '0.0.0.0',
  port: settings.port,
  routes: {
    cors: {
      credentials: true,
      origin: settings.allowedOrigins
    }
  }
});

server.register([
  HapiAuthCookie,
  {
    register: Disinfect,
    options: {
      disinfectQuery: true,
      disinfectParams: true,
      disinfectPayload: true,
      deleteWhitespace: true,
      deleteEmpty: true
    }
  },
  {
    register: Nes,
    auth: {
      route: 'session'
    }
  }], function (err) {
    if (err) {
      throw err;
    }

    server.auth.strategy('session', 'cookie', {
      cookie: 'accessToken',
      password: settings.cookiePassword,
      validateFunc: authController.validate,
      redirectTo: false,
      clearInvalid: true,
      domain: settings.cookieDomain,
      isSecure: settings.environment !== 'development',

      // Unfortunately, WS client cannot read http-only cookies..
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
