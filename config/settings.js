'use strict';

let path = require('path');
let jwt = require('jwt-simple');

const jwtSecret = process.env.NODE_ENV === 'production' ?
  process.env.JWT_SECRET :
  '9a1bd1db-4cd2-4cff-adf7-41a89d144486';

const cookiePassword = process.env.NODE_ENV === 'production' ?
  process.env.COOKIE_PASSWORD :
  '&YD/SRKY{5xhE%Qk.8Kuyj`=(]gc4<qR';

const rootPath = path.normalize(__dirname + '/..');

const environment = process.env.NODE_ENV || 'development';

module.exports = {
  rootPath,
  jwtSecret,
  environment,
  cookiePassword
};
