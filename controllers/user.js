'use strict';

let user = require('../models/user');
let message = require('../models/msg');
let Boom = require('boom');
let bcrypt = require('bcryptjs');
let jwt = require('jwt-simple');
let jwtSecret = require('../config/settings').jwtSecret;

module.exports = {

  getUser: function (request, reply) {
    new user.User({ id: request.params.id })
      .fetch({ withRelated: ['channels'], require: true })
      .then(function(user) {
        let response = user.toJSON({ omitPivot: true });
        delete response.password;
        reply(response);
      })
      .catch(function (err) {
        reply(Boom.notFound('User not found.'));
      });
  },

  getUsers: function (request, reply) {
    new user.User()
      .fetchAll()
      .then(function(users) {
        let response = users.toJSON({ omitPivot: true });
        response.forEach(user => delete user.password);
        reply(response);
      })
  },

  getMessages: function (request, reply) {
    new message.Message({ userid: request.params.id} )
      .fetchAll()
      .then(function(messages) {
        reply(messages.toJSON({ omitPivot: true }));
      });
  },

  postMessage: function (request, reply) {
    let newMessage = {
      userid: Number(request.params.id),
      channelid: request.payload.channelid,
      content: request.payload.content,
      createdat: new Date(),
      updatedat: new Date()
    };

    new message.Message(newMessage)
      .save()
      .then(function(message) {
        reply(message.toJSON({ omitPivot: true }));
      })
      .catch(function(err) {
        console.log(err);
      });
  },

  createUser: function (request, reply) {
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
          user = user.toJSON();

          let payload = {
            id: user.id,
            username: user.name
          };

          let jwtToken = jwt.encode(payload, jwtSecret);

          reply({ userid: payload.id, token: jwtToken });
        })
        .catch(function(err) {
          reply(Boom.unauthorized('User could not be created.'));
        });
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

            reply({ userid: user.id, token: jwtToken });
          } else {
            reply(Boom.unauthorized('Incorrect password.'));
          }
        });
      })
      .catch(function (err) {
        reply(Boom.unauthorized('User not found.'));
      });
  },

  verifyJwtToken: function (request, reply) {
    jwt.decode(request.headers['authorization'].split(' ')[1], jwtSecret, false, 'HS256');
    reply.continue();
  }
};
