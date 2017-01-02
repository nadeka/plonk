'use strict';

let channelController = require('../controllers/channel');
let validators = require('../validators/validators');

module.exports = [
  {
    path: '/channels/{id}',
    method: 'GET',
    config: {
      auth: 'token',
      handler: channelController.getChannel,
      validate: {
        params: {
          id: validators.id
        }
      }
    }
  },
  {
    path: '/channels',
    method: 'GET',
    config: {
      auth: 'token',
      handler: channelController.getChannels
    }
  },
  {
    path: '/channels/{id}/messages',
    method: 'POST',
    config: {
      auth: 'token',
      handler: channelController.postMessage,
      validate: {
        payload: validators.message,
        params: {
          id: validators.id
        }
      }
    }
  },
  {
    path: '/channels/{id}/join',
    method: 'POST',
    config: {
      auth: 'token',
      handler: channelController.joinChannel,
      validate: {
        params: {
          id: validators.id
        }
      }
    }
  },
  {
    path: '/channels',
    method: 'POST',
    config: {
      auth: 'token',
      handler: channelController.createChannel,
      validate: {
        payload: validators.channel
      }
    }
  }
];
