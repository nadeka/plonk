exports.seed = function(knex, Promise) {
  return Promise.join(
    knex('channel').del()
      .then(function() {
        return knex.raw('ALTER SEQUENCE channel_id_seq RESTART WITH 1;');
      })
      .then(function() {
        return knex('channel').insert({
          name: 'Movies',
          creatorid: 1,
          private: false,
          createdat: new Date(),
          updatedat: new Date()
        });
      })
      .then(function() {
        return knex('channel').insert({
          name: 'Books',
          creatorid: 1,
          private: false,
          createdat: new Date(),
          updatedat: new Date()
        });
      })
      .then(function() {
        return knex('channel').insert({
          name: 'Football',
          creatorid: 2,
          private: false,
          createdat: new Date(),
          updatedat: new Date()
        });
      })
  );
};
