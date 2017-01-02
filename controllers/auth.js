'use strict';

let user = require('../models/user');
let Boom = require('boom');
let bcrypt = require('bcryptjs');
const jwt = require('jwt-simple');
const jwtSecret = require('../config/settings').jwtSecret;

module.exports = {

  validate: function (request, decodedToken, callback) {
    new user.User({ id: decodedToken.id })
      .fetch({ require: true })
      .then(function(user) {
        user = user.toJSON();

        request.userid = user.id;

        callback(null, true, user);
      })
      .catch(function (err) {
        callback(err, false, null);
      });
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

            let jwtToken = jwt.encode(payload, jwtSecret);

            delete user.password;

            reply({ user: user, token: jwtToken });
          } else {
            reply(Boom.unauthorized('Incorrect password.'));
          }
        });
      })
      .catch(function (err) {
        reply(Boom.unauthorized('User not found.'));
      });
  },

  register: function (request, reply) {
    bcrypt.hash(request.payload.password, 10, function(err, hash) {
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

          let jwtToken = jwt.encode(payload, jwtSecret);

          delete user.password;

          reply({ user: user, token: jwtToken });
        })
        .catch(function(err) {
          reply(Boom.badRequest('User could not be created.'));
        });
    });
  }
};
