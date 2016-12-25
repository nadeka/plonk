'use strict';

let userController = require('../controllers/user');
let validators = require('../validators/validators');

module.exports = [
  {
    path: '/users/{id}',
    method: 'GET',
    config: {
      handler: userController.getUser
    }
  },
  {
    path: '/users',
    method: 'GET',
    config: {
      handler: userController.getUsers
    }
  },
  {
    path: '/users/{id}/messages',
    method: 'GET',
    config: {
      handler: userController.getMessages
    }
  },
  {
    path: '/users/{id}/messages',
    method: 'POST',
    config: {
      handler: userController.postMessage,
      validate: {
        payload: validators.message
      }
    }
  },
  {
    path: '/users',
    method: 'POST',
    config: {
      handler: userController.createUser,
      validate: {
        payload: validators.user
      }
    }
  }
];
