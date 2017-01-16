'use strict';

let userController = require('../controllers/user');
let validators = require('../validators/validators');

module.exports = [
  {
    path: '/user/channels',
    method: 'GET',
    config: {
      auth: 'session',
      handler: userController.getChannels,
      validate: {
        params: {
          id: validators.id
        }
      }
    }
  },
  {
    path: '/user/receivedInvitations',
    method: 'GET',
    config: {
      auth: 'session',
      handler: userController.getReceivedInvitations,
      validate: {
        params: {
          id: validators.id
        }
      }
    }
  },
  {
    path: '/user/receivedInvitations/{id}/delete',
    method: 'POST',
    config: {
      auth: 'session',
      handler: userController.deleteReceivedInvitation,
      validate: {
        params: {
          id: validators.id
        }
      }
    }
  }
];
