exports.up = function(knex, Promise) {
  return knex.schema.createTable('channel_user', function(t) {
    t.increments().primary();
    t.integer('userid').references('user.id').onDelete('CASCADE');
    t.integer('channelid').references('channel.id').onDelete('CASCADE');
    t.dateTime('createdat').notNull();
    t.dateTime('updatedat').nullable();
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('channel_user');
};
