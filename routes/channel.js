'use strict';

let channelController = require('../controllers/channel');
let validators = require('../validators/validators');

module.exports = [
  {
    path: '/channels/{id}',
    method: 'GET',
    config: {
      handler: channelController.getChannel
    }
  },
  {
    path: '/channels',
    method: 'GET',
    config: {
      handler: channelController.getChannels
    }
  },
  {
    path: '/channels',
    method: 'POST',
    config: {
      handler: channelController.createChannel,
      validate: {
        payload: validators.channel
      }
    }
  }
];
