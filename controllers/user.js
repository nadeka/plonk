'use strict';

let Boom = require('boom');

let user = require('../models/user');
let channel = require('../models/channel');
let invitation = require('../models/invitation');

module.exports = {

  getChannels: function (request, reply) {
    new channel.Channel().query(function (qb) {
      qb.innerJoin('channel_user', 'channel.id', 'channel_user.channelid')
        .innerJoin('user', 'channel_user.userid', 'user.id')
        .where({ 'channel_user.userid': request.auth.credentials.id });
      })
      .fetchAll({ withRelated: [{
        'users': function (qb) {
          qb.column('user.id', 'user.name');
      }}, {'messages.user': function(qb) {
          qb.column('user.id', 'user.name');
      }}] })
      .then(function(channels) {
        channels = channels.toJSON({ omitPivot: true });

        reply(channels);
      })
      .catch(function(err) {
        console.log(err);
        reply(Boom.badImplementation('Channels of user could not be fetched from database'));
      });
  },

  getReceivedInvitations: function (request, reply) {
    new invitation.Invitation()
      .where({ inviteeid: request.auth.credentials.id })
      .fetchAll({ withRelated: [{
        'inviter': function(qb) {
          qb.column('id', 'name');
        }}, {
        'channel': function(qb) {
          qb.column('id', 'name');
        }}]
      })
      .then(function(invitations) {
        invitations = invitations.toJSON({ omitPivot: true });

        reply(invitations);
      })
      .catch(function(err) {
        console.log(err);
        reply(Boom.badImplementation('Channels of user could not be fetched from database'));
      });
  }
};
