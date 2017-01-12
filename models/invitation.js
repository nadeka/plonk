'use strict';

let bookshelf = require('../config/bookshelf');

let Invitation = bookshelf.Model.extend({
  tableName: 'invitation',
  invitee: function() {
    return this.belongsTo('User');
  },
  inviter: function() {
    return this.belongsTo('User');
  },
  channel: function() {
    return this.belongsTo('Channel');
  }
});

bookshelf.model('Invitation', Invitation);

module.exports = {
  Invitation: Invitation
};
