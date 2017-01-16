'use strict';

let bookshelf = require('../config/bookshelf');

let Invitation = bookshelf.Model.extend({
  tableName: 'invitation',
  invitee: function() {
    return this.belongsTo('User', 'inviteeid');
  },
  inviter: function() {
    return this.belongsTo('User', 'inviterid');
  },
  channel: function() {
    return this.belongsTo('Channel', 'channelid');
  }
});

bookshelf.model('Invitation', Invitation);

module.exports = {
  Invitation: Invitation
};
