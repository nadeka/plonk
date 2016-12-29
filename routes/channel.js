'use strict';

let channelController = require('../controllers/channel');
let userController = require('../controllers/user');
let validators = require('../validators/validators');

module.exports = [
  {
    path: '/channels/{id}',
    method: 'GET',
    config: {
      pre : [
        { method: userController.verifyJwtToken }
      ],
      handler: channelController.getChannel
    }
  },
  {
    path: '/channels',
    method: 'GET',
    config: {
      pre : [
        { method: userController.verifyJwtToken }
      ],
      handler: channelController.getChannels
    }
  },
  {
    path: '/channels/{id}/messages',
    method: 'GET',
    config: {
      pre : [
        { method: userController.verifyJwtToken }
      ],
      handler: channelController.getMessages
    }
  },
  {
    path: '/channels/{id}/join',
    method: 'POST',
    config: {
      pre : [
        { method: userController.verifyJwtToken }
      ],
      handler: channelController.joinChannel,
      validate: {
        payload: validators.joiningUser
      }
    }
  },
  {
    path: '/channels',
    method: 'POST',
    config: {
      pre : [
        { method: userController.verifyJwtToken }
      ],
      handler: channelController.createChannel,
      validate: {
        payload: validators.channel
      }
    }
  }
];
