exports.seed = function(knex, Promise) {
  return Promise.join(
    knex('channel_user').del()
      .then(function() {
        return knex.raw('ALTER SEQUENCE channel_user_id_seq RESTART WITH 1;');
      })
      .then(function() {
        return knex('channel_user').insert({
          channelid: 1,
          userid: 1,
          createdat: new Date(),
          updatedat: new Date()
        });
      })
      .then(function() {
        return knex('channel_user').insert({
          channelid: 2,
          userid: 1,
          createdat: new Date(),
          updatedat: new Date()
        });
      })
  );
};
