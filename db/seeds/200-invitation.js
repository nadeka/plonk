exports.seed = function(knex, Promise) {
  return Promise.join(
    knex('invitation').del()
      .then(function() {
        return knex.raw('ALTER SEQUENCE invitation_id_seq RESTART WITH 1;');
      })
      .then(function() {
        return knex('invitation').insert({
          channelid: 3,
          inviteeid: 1,
          inviterid: 2,
          message: 'Join my channel!',
          createdat: new Date(),
          updatedat: new Date()
        });
      })
      .then(function() {
        return knex('invitation').insert({
          channelid: 1,
          inviteeid: 2,
          inviterid: 1,
          message: 'Please join.',
          createdat: new Date(),
          updatedat: new Date()
        });
      })
  );
};
