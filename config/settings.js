'use strict';

let path = require('path');

module.exports = {
  rootPath: path.normalize(__dirname + '/..'),

  environment: process.env.NODE_ENV || 'development'
};
