'use strict';

let bookshelf = require('../config/bookshelf');

let Channel = bookshelf.Model.extend({
  tableName: 'channel',
  users: function() {
    return this.belongsToMany('User', 'channel_user',
      'channelid', 'userid');
  },
  messages: function() {
    return this.hasMany('Message', 'channelid');
  }
});

bookshelf.model('Channel', Channel);

module.exports = {
  Channel: Channel
};
