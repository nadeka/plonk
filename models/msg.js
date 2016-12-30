'use strict';

let bookshelf = require('../config/bookshelf');

let Message = bookshelf.Model.extend({
  tableName: 'message',
  user: function() {
    return this.belongsTo('User');
  },
  channel: function() {
    return this.belongsTo('Channel');
  }
});

bookshelf.model('Message', Message);

module.exports = {
  Message: Message
};
