'use strict';

let user = require('../models/user');
let message = require('../models/msg');
let Boom = require('boom');

module.exports = {

  getUser: function (request, reply) {
    new user.User({id: request.params.id})
      .fetch({withRelated: ['channels'], require: true})
      .then(function(user) {
        reply(user.toJSON({ omitPivot: true }));
      })
      .catch(function (err) {
        reply(Boom.notFound('User not found.'));
      });
  },

  getUsers: function (request, reply) {
    new user.User()
      .fetchAll()
      .then(function(users) {
        reply(users.toJSON({ omitPivot: true }));
      })
  },

  getMessages: function (request, reply) {
    new message.Message({userid: request.params.id})
      .fetchAll()
      .then(function(messages) {
        reply(messages.toJSON({ omitPivot: true }));
      });
  },

  postMessage: function (request, reply) {
    let newMessage = {
      userid: request.params.userid,
      channelid: request.params.channelid,
      content: request.payload.content,
      createdat: new Date(),
      updatedat: new Date()
    };

    new message.Message(newMessage)
      .save()
      .then(function(message) {
        reply(message.toJSON({ omitPivot: true }));
      });
  },

  createUser: function (request, reply) {
    let newUser = {
      name: request.payload.name,
      password: request.payload.password,
      createdat: new Date(),
      updatedat: new Date()
    };

    new user.User(newUser)
      .save()
      .then(function(user) {
        reply(user.toJSON({ omitPivot: true }));
      });
  }
};
