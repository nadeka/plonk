'use strict';

let authController = require('../controllers/auth');
let validators = require('../validators/validators');

module.exports = [
  {
    path: '/register',
    method: 'POST',
    config: {
      handler: authController.register,
      validate: {
        payload: validators.user
      }
    }
  },
  {
    path: '/login',
    method: 'POST',
    config: {
      handler: authController.login,
      validate: {
        payload: validators.user
      }
    }
  },
  {
    path: '/logout',
    method: 'POST',
    config: {
      handler: authController.logout
    }
  },
  {
    path: '/reauthenticate',
    method: 'POST',
    config: {
      handler: authController.reauthenticate,
      auth: 'session'
    }
  }
];
