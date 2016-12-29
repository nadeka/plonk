'use strict';

let userController = require('../controllers/user');
let validators = require('../validators/validators');

module.exports = [
  {
    path: '/users/{id}',
    method: 'GET',
    config: {
      pre : [
        { method: userController.verifyJwtToken }
      ],
      handler: userController.getUser
    }
  },
  {
    path: '/users',
    method: 'GET',
    config: {
      pre : [
        { method: userController.verifyJwtToken }
      ],
      handler: userController.getUsers
    }
  },
  {
    path: '/users/{id}/messages',
    method: 'GET',
    config: {
      pre : [
        { method: userController.verifyJwtToken }
      ],
      handler: userController.getMessages
    }
  },
  {
    path: '/users/{id}/messages',
    method: 'POST',
    config: {
      pre : [
        { method: userController.verifyJwtToken }
      ],
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
  },
  {
    path: '/login',
    method: 'POST',
    config: {
      handler: userController.login,
      validate: {
        payload: validators.user
      }
    }
  }
];
