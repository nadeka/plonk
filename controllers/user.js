'use strict';

let user = require('../models/user');
let Boom = require('boom');

module.exports = {

  getUser: function (request, reply) {
    new user.User({ id: request.params.id })
      .fetch({ withRelated: ['channels', 'messages'], require: true })
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
      .fetchAll({ withRelated: ['channels', 'messages'] })
      .then(function(users) {
        let response = users.toJSON({ omitPivot: true });
        response.forEach(user => delete user.password);
        reply(response);
      })
      .catch(function(err) {
        reply(Boom.notFound('Users not found.'));
      });
  }
};
