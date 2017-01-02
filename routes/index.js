'use strict';

let user = require('./user');
let channel = require('./channel');
let auth = require('./auth');

module.exports = [].concat(user, channel, auth);
