'use strict';

let userController = require('../controllers/user');
let validators = require('../validators/validators');

module.exports = [
  {
    path: '/users/{id}',
    method: 'GET',
    config: {
      auth: 'session',
      handler: userController.getUser,
      validate: {
        params: {
          id: validators.id
        }
      }
    }
  },
  {
    path: '/users',
    method: 'GET',
    config: {
      auth: 'session',
      handler: userController.getUsers
    }
  }
];
