'use strict';

let bookshelf = require('../config/bookshelf');

let User = bookshelf.Model.extend({
  tableName: 'user',
  messages: function() {
    return this.hasMany('Message', 'userid');
  },
  channels: function() {
    return this.belongsToMany('Channel', 'channel_user',
      'userid', 'channelid');
  }
});

bookshelf.model('User', User);

module.exports = {
  User: User
};
