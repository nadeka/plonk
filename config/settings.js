'use strict';

let path = require('path');
let jwt = require('jwt-simple');

const jwtSecret = process.env.NODE_ENV === 'production' ?
  process.env.JWT_SECRET :
  '9a1bd1db-4cd2-4cff-adf7-41a89d144486';

const testToken = 'Bearer ' + jwt.encode({ id: 1, name: 'Salli' }, jwtSecret);

const rootPath = path.normalize(__dirname + '/..');

const environment = process.env.NODE_ENV || 'development';

module.exports = {
  rootPath,
  jwtSecret,
  testToken,
  environment
};
