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
      .catch(function(err) {
        reply(Boom.notFound('Channels not found.'));
      });
  },

  postMessage: function (request, reply) {
    let newMessage = {
      userid: request.userid,
      channelid: Number(request.params.id),
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
        reply(Boom.badRequest('Message could not be created.'));
      });
  },

  joinChannel: function (request, reply) {
    new channel.Channel({ id: request.params.id })
      .fetch({ require: true })
      .then(function(ch) {
        ch.load(['users'])
          .then(function(model) {
            model.users().attach({
                userid: request.userid,
                createdat: new Date(),
                updatedat: new Date()
            }).then(function(m) {
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
            }).catch(function(err) {
              reply(Boom.internal('Channel could not be joined.'));
            })
          }).catch(function(err) {
            reply(Boom.internal('Channel could not be joined.'));
          })
      })
      .catch(function(err) {
        reply(Boom.notFound('Channel not found.'));
      })
  },

  createChannel: function (request, reply) {
    let newChannel = {
      name: request.payload.name,
      private: request.payload.private,
      creatorid: request.userid,
      createdat: new Date(),
      updatedat: new Date()
    };

    new channel.Channel(newChannel)
      .save()
      .then(function(channel) {
        reply(channel.toJSON({ omitPivot: true }));
      })
      .catch(function(err) {
        console.log(err);
        reply(Boom.badRequest('Channel could not be created.'));
      });
  }
};
