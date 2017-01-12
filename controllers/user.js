'use strict';

let Boom = require('boom');

let user = require('../models/user');

module.exports = {

  getUser: function (request, reply) {
    new user.User({ id: request.params.id })
      .fetch({ withRelated: ['channels', 'messages', 'receivedInvitations'], require: true })
      .then(function(user) {
        let response = user.toJSON({ omitPivot: true });

        delete response.password;

        reply(response);
      })
      .catch(function(err) {
        reply(Boom.notFound('User not found'));
      });
  },

  getUsers: function (request, reply) {
    new user.User()
      .fetchAll({ withRelated: ['channels', 'messages', 'receivedInvitations'] })
      .then(function(users) {
        let response = users.toJSON({ omitPivot: true });

        response.forEach(user => delete user.password);

        reply(response);
      })
      .catch(function(err) {
        reply(Boom.badImplementation('Users could not be fetched from database'));
      });
  }
};
