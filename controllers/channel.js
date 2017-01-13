'use strict';

let Boom = require('boom');

let channel = require('../models/channel');
let message = require('../models/msg');
let user = require('../models/user');
let invitation = require('../models/invitation');
let server = require('../server').server;

module.exports = {

  getChannel: function (request, reply) {
    new channel.Channel({ id: request.params.id })
      .fetch({ withRelated: ['users', 'messages'], require: true })
      .then(function(channel) {
        channel = channel.toJSON({ omitPivot: true });

        channel.users.forEach(user => delete user.password);

        reply(channel);
      })
      .catch(function(err) {
        reply(Boom.notFound('Channel not found'));
      });
  },

  getChannels: function (request, reply) {
    new channel.Channel()
      .fetchAll()
      .then(function(channels) {
        channels = channels.toJSON({ omitPivot: true });

        reply(channels);
      })
      .catch(function(err) {
        reply(Boom.badImplementation('Channels could not be fetched from database'));
      });
  },

  postMessage: function (request, reply) {
    let newMessage = {
      userid: request.auth.credentials.id,
      channelid: Number(request.params.id),
      content: request.payload.content,
      createdat: new Date(),
      updatedat: new Date()
    };

    new message.Message(newMessage)
      .save()
      .then(function(message) {
        message = message.toJSON({ omitPivot: true });

        server.publish(`/channels/${message.channelid}/new-message`, message);

        reply(message);
      })
      .catch(function(err) {
        reply(Boom.badImplementation('Message could not be saved to database'));
      });
  },

  joinChannel: function (request, reply) {
    new channel.Channel({ id: request.params.id })
      .fetch({ require: true })
      .then(function(ch) {
        ch.load(['users'])
          .then(function(model) {
            model.users().attach({
                userid: request.auth.credentials.id,
                createdat: new Date(),
                updatedat: new Date()
            }).then(function(m) {
              new channel.Channel({ id: request.params.id })
                .fetch({ withRelated: ['users', 'messages'], require: true })
                .then(function(channel) {
                  channel = channel.toJSON({ omitPivot: true });

                  channel.users.forEach(user => delete user.password);

                  server.publish(`/channels/${channel.id}/new-member`, channel);

                  reply(channel);
                })
                .catch(function(err) {
                  reply(Boom.badImplementation('Could not be fetch channel after attaching user'));
                });
            }).catch(function(err) {
              reply(Boom.badImplementation('Could not attach user to channel'));
            })
          }).catch(function(err) {
            reply(Boom.badImplementation('Could not load users of channel'));
          })
      })
      .catch(function(err) {
        reply(Boom.notFound('Channel not found'));
      })
  },

  inviteUser: function (request, reply) {
    new user.User({ name: request.payload.inviteename })
      .fetch({ require: true })
      .then(function(user) {
        user = user.toJSON({ omitPivot: true });

        let newInvitation = {
          inviterid: request.auth.credentials.id,
          inviteeid: user.id,
          channelid: Number(request.params.id),
          message: request.payload.message || null,
          createdat: new Date(),
          updatedat: new Date()
        };

        new invitation.Invitation(newInvitation)
          .save()
          .then(function(invitation) {
            invitation = invitation.toJSON({ omitPivot: true });

            server.publish(`/users/${user.id}/invitations`, invitation);

            reply(invitation);
          })
          .catch(function(err) {
            console.log(err);
            reply(Boom.badImplementation('Invitation could not be saved to database'));
          });
      })
      .catch(function(err) {
        reply(Boom.notFound('Invited user not found'));
      });
  },

  createChannel: function (request, reply) {
    let newChannel = {
      name: request.payload.name,
      private: request.payload.private,
      creatorid: request.auth.credentials.id,
      createdat: new Date(),
      updatedat: new Date()
    };

    new channel.Channel(newChannel)
      .save()
      .then(function(channel) {
        channel = channel.toJSON({ omitPivot: true });

        server.publish('/new-channel', channel);

        reply(channel);
      })
      .catch(function(err) {
        reply(Boom.badImplementation('Channel could not be saved to database. Name might already be taken'));
      });
  }
};
