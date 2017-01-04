'use strict';

let channelController = require('../controllers/channel');
let validators = require('../validators/validators');

module.exports = [
  {
    path: '/channels/{id}',
    method: 'GET',
    config: {
      auth: 'session',
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
      auth: 'session',
      handler: channelController.getChannels
    }
  },
  {
    path: '/channels/{id}/messages',
    method: 'POST',
    config: {
      auth: 'session',
      handler: channelController.postMessage,
      validate: {
        payload: validators.message,
        params: {
          id: validators.id
        },
      }
    }
  },
  {
    path: '/channels/{id}/join',
    method: 'POST',
    config: {
      auth: 'session',
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
      auth: 'session',
      handler: channelController.createChannel,
      validate: {
        payload: validators.channel
      }
    },
  }
];
