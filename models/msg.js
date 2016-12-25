'use strict';

let bookshelf = require('../config/bookshelf');

let Message = bookshelf.Model.extend({
  tableName: 'message'
});

bookshelf.model('Message', Message);

module.exports = {
  Message: Message
};
