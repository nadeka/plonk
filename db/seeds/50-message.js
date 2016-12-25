exports.seed = function(knex, Promise) {
  return Promise.join(
    knex('message').del()
      .then(function() {
        return knex.raw('ALTER SEQUENCE message_id_seq RESTART WITH 1;');
      })
      .then(function() {
        return knex('message').insert({
          userid: 1,
          channelid: 1,
          content: 'I like Pulp Fiction.',
          createdat: new Date(),
          updatedat: new Date()
        });
      })
  );
};
