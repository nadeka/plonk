'use strict';

let channel = require('../models/channel');
let Boom = require('boom');

module.exports = {

  getChannel: function (request, reply) {
    new channel.Channel({id: request.params.id})
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
