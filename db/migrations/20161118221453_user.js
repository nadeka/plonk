exports.up = function(knex, Promise) {
  return knex.schema.createTable('user', function(t) {
    t.increments().primary();
    t.string('name').notNull();
    t.string('password').notNull();
    t.dateTime('createdat').notNull();
    t.dateTime('updatedat').nullable();
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('user');
};
