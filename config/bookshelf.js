'use strict';

let knexConfig = require('../knexfile');
let settings = require('./settings');

let knex = require('knex')(knexConfig[settings.environment]);

let bookshelf = require('bookshelf')(knex);

bookshelf.plugin('registry');
bookshelf.plugin('virtuals');
bookshelf.plugin('visibility');

module.exports = bookshelf;
