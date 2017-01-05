'use strict';

let path = require('path');
let jwt = require('jwt-simple');

const environment = process.env.NODE_ENV || 'development';

const port = process.env.PORT || 6001;

const jwtSecret = environment === 'production' ?
  process.env.JWT_SECRET :
  '9a1bd1db-4cd2-4cff-adf7-41a89d144486';

const cookiePassword = environment === 'production' ?
  process.env.COOKIE_PASSWORD :
  '&YD/SRKY{5xhE%Qk.8Kuyj`=(]gc4<qR';

const rootPath = path.normalize(__dirname + '/..');

const cookieDomain = environment === 'production' ?
  '.exoenzy.me' :
  null;

const allowedOrigins = ['https://exoenzy.me', 'http://localhost:3000'];

module.exports = {
  port,
  rootPath,
  jwtSecret,
  environment,
  cookieDomain,
  allowedOrigins,
  cookiePassword
};
