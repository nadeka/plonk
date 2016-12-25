exports.seed = function(knex, Promise) {
  return Promise.join(
    knex('user').del()
      .then(function() {
        return knex.raw('ALTER SEQUENCE user_id_seq RESTART WITH 1;');
      })
      .then(function() {
        return knex('user').insert({
          name: 'Salli',
          password: 'sallisa',
          createdat: new Date(),
          updatedat: new Date()
        });
      })
      .then(function() {
        return knex('user').insert({
          name: 'naffe',
          password: 'naffe95',
          createdat: new Date(),
          updatedat: new Date()
        });
      })
  );
};