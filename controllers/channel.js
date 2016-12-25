'use strict';

let channel = require('../models/channel');
let Boom = require('boom');

module.exports = {

  getChannel: function (request, reply) {
    new channel.Channel({ id: request.params.id })
      .fetch({ withRelated: ['users', 'messages'], require: true })
      .then(function(channel) {
        reply(channel.toJSON({ omitPivot: true }));
      })
      .catch(function (err) {
        reply(Boom.notFound('Channel not found.'));
      });
  },

  getChannels: function (request, reply) {
    new channel.Channel()
      .fetchAll({ withRelated: ['users', 'messages'] })
      .then(function(channels) {
        reply(channels.toJSON({ omitPivot: true }));
      })
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
