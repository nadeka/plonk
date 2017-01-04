'use strict';

let user = require('../models/user');
let Boom = require('boom');
let bcrypt = require('bcryptjs');
const jwt = require('jwt-simple');
const jwtSecret = require('../config/settings').jwtSecret;

module.exports = {

  validate: function (request, cookie, callback) {
    let payload = jwt.decode(cookie.accessToken, jwtSecret, false, 'HS256');

    if (payload) {
      new user.User({ id: payload.id })
        .fetch({ require: true })
        .then(function(user) {
          user = user.toJSON({ omitPivot: true });

          delete user.password;

          callback(null, true, user);
        })
        .catch(function (err) {
          callback(Boom.unauthorized('Invalid JWT token.'), false, null);
        });
    }
    else {
      callback(Boom.unauthorized('Invalid JWT token.'), false, null);
    }
  },

  login: function (request, reply) {
    new user.User({ name: request.payload.name })
      .fetch({ require: true })
      .then(function(user) {
        user = user.toJSON();

        bcrypt.compare(request.payload.password, user.password, function(err, res) {
          if (res) {
            let payload = {
              id: user.id,
              username: user.name
            };

            let jwtToken = jwt.encode(payload, jwtSecret, 'HS256');

            delete user.password;

            request.cookieAuth.set({ accessToken: jwtToken });

            reply(user);
          } else {
            reply(Boom.unauthorized('Incorrect password.'));
          }
        });
      })
      .catch(function (err) {
        reply(Boom.unauthorized('User not found.'));
      });
  },

  reauthenticate: function (request, reply) {
    reply(request.auth.credentials);
  },

  register: function (request, reply) {
    bcrypt.hash(request.payload.password, 10, function(err, hash) {
      if (err) {
        reply(Boom.badRequest('User could not be created.'));
      }

      request.payload.password = hash;

      let newUser = {
        name: request.payload.name,
        password: request.payload.password,
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

          let jwtToken = jwt.encode(payload, jwtSecret, 'HS256');

          delete user.password;

          request.cookieAuth.set({ accessToken: jwtToken });

          reply(user);
        })
        .catch(function(err) {
          reply(Boom.badRequest('User could not be created.'));
        });
    });
  }
};
