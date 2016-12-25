'use strict';

const Hapi = require('hapi');

const server = new Hapi.Server();

server.connection({
  host: '0.0.0.0',
  port: process.env.PORT || 6001,
  routes: {
    cors: true
  }});

const routes = require('./routes');
server.route(routes);

server.start((err) => {
  if (err) {
    throw err;
  }

  console.log(`Server running at: ${server.info.uri}`);
});

module.exports = server;
