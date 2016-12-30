'use strict';

let channel = require('../models/channel');
let message = require('../models/msg');
let Boom = require('boom');

module.exports = {

  getChannel: function (request, reply) {
    new channel.Channel({ id: request.params.id })
      .fetch({ withRelated: ['users', 'messages'], require: true })
      .then(function(channel) {
        let response = channel.toJSON({ omitPivot: true });

        response.users.forEach(user => delete user.password);

        reply(response);
      })
      .catch(function (err) {
        reply(Boom.notFound('Channel not found.'));
      });
  },

  getChannels: function (request, reply) {
    new channel.Channel()
      .fetchAll({ withRelated: ['users', 'messages'] })
      .then(function(channels) {
        let response = channels.toJSON({ omitPivot: true });

        response.forEach(function(channel) {
          channel.users.forEach(user => delete user.password);
        });

        reply(response);
      })
  },

  getMessages: function (request, reply) {
    new message.Message({ channelid: request.params.id })
      .fetchAll()
      .then(function(messages) {
        reply(messages.toJSON({ omitPivot: true }));
      });
  },

  joinChannel: function (request, reply) {
    new channel.Channel({ id: request.params.id })
      .fetch({ require: true })
      .then(function(channel) {
        channel.load(['users'])
          .then(function(model) {
            model.users().attach({
                userid: request.payload.userid,
                createdat: new Date(),
                updatedat: new Date()
            }).then(function(m) {
                reply('Successfully joined channel.');
            }).catch(function(err) {
              reply(Boom.notFound('Channel could not be joined.'));
            })
          }).catch(function(err) {
            reply(Boom.notFound('Channel could not be joined.'));
          })
      })
      .catch(function(err) {
        reply(Boom.notFound('Channel could not be joined.'));
      })
  },

  createChannel: function (request, reply) {
    let newChannel = {
      name: request.payload.name,
      private: request.payload.private,
      creatorid: request.payload.creatorid,
      createdat: new Date(),
      updatedat: new Date()
    };

    new channel.Channel(newChannel)
      .save()
      .then(function(channel) {
        reply(channel.toJSON({ omitPivot: true }));
      });
  }
};
