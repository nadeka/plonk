'use strict';

let userController = require('../controllers/user');
let validators = require('../validators/validators');

module.exports = [
  {
    path: '/users/{id}',
    method: 'GET',
    config: {
      auth: 'token',
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
      auth: 'token',
      handler: userController.getUsers
    }
  }
];
