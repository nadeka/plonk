'use strict';

let Boom = require('boom');

let user = require('../models/user');
let channel = require('../models/channel');

module.exports = {

  getUser: function (request, reply) {
    new user.User({ id: request.params.id })
      .fetch({ withRelated: ['channels', 'messages', 'receivedInvitations'], require: true })
      .then(function(user) {
        user = user.toJSON({ omitPivot: true });

        delete user.password;

        reply(user);
      })
      .catch(function(err) {
        reply(Boom.notFound('User not found'));
      });
  },

  getUsers: function (request, reply) {
    new user.User()
      .fetchAll({ withRelated: ['channels', 'messages', 'receivedInvitations'] })
      .then(function(users) {
        users = users.toJSON({ omitPivot: true });

        users.forEach(user => delete user.password);

        reply(users);
      })
      .catch(function(err) {
        reply(Boom.badImplementation('Users could not be fetched from database'));
      });
  },

  getChannels: function (request, reply) {
    new channel.Channel({ userid: request.params.id })
      .fetchAll({ withRelated: ['users', 'messages'] })
      .then(function(channels) {
        channels = channels.toJSON({ omitPivot: true });

        channels.forEach(function(channel) {
          channel.users.forEach(user => delete user.password);
        });

        reply(channels);
      })
      .catch(function(err) {
        reply(Boom.badImplementation('Channels of user could not be fetched from database'));
      });
  }
};
