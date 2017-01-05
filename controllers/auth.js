'use strict';

let Boom = require('boom');
let Bcrypt = require('bcryptjs');
let Jwt = require('jwt-simple');

let jwtSecret = require('../config/settings').jwtSecret;
let user = require('../models/user');
let server = require('../server');

module.exports = {

  validate: function (request, cookie, callback) {
    let payload = Jwt.decode(cookie.accessToken, jwtSecret, false, 'HS256');

    if (payload) {
      new user.User({ id: payload.id })
        .fetch({ require: true })
        .then(function(user) {
          user = user.toJSON({ omitPivot: true });

          delete user.password;

          callback(null, true, user);
        })
        .catch(function(err) {
          callback(Boom.unauthorized('Invalid JWT token'), false, null);
        });
    }
    else {
      callback(Boom.unauthorized('Invalid JWT token'), false, null);
    }
  },

  login: function (request, reply) {
    new user.User({ name: request.payload.name })
      .fetch({ require: true })
      .then(function(user) {
        user = user.toJSON();

        Bcrypt.compare(request.payload.password, user.password, function(err, res) {
          if (res) {
            let payload = {
              id: user.id,
              username: user.name
            };

            let jwtToken = Jwt.encode(payload, jwtSecret, 'HS256');

            delete user.password;

            request.cookieAuth.set({ accessToken: jwtToken });

            reply(user);
          } else {
            reply(Boom.unauthorized('Incorrect password'));
          }
        });
      })
      .catch(function(err) {
        reply(Boom.notFound('User not found'));
      });
  },

  reauthenticate: function (request, reply) {
    reply(request.auth.credentials);
  },

  register: function (request, reply) {
    Bcrypt.hash(request.payload.password, 10, function(err, hash) {
      if (err) {
        reply(Boom.badImplementation('Password hashing failed'));
      }

      let newUser = {
        name: request.payload.name,
        password: hash,
        createdat: new Date(),
        updatedat: new Date()
      };

      new user.User(newUser)
        .save()
        .then(function(user) {
          user = user.toJSON({ omitPivot: true });

          let payload = {
            id: user.id,
            username: user.name
          };

          let jwtToken = Jwt.encode(payload, jwtSecret, 'HS256');

          delete user.password;

          request.cookieAuth.set({ accessToken: jwtToken });

          reply(user);
        })
        .catch(function(err) {
          reply(Boom.badImplementation('User could not be saved to database. Name might already be taken'));
        });
    });
  }
};
