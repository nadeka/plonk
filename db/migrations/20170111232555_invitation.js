exports.up = function(knex, Promise) {
  return knex.schema.createTable('invitation', function(t) {
    t.increments().primary();
    t.integer('inviteeid').references('user.id').onDelete('CASCADE');
    t.integer('inviterid').references('user.id').onDelete('CASCADE');
    t.integer('channelid').references('channel.id').onDelete('CASCADE');
    t.text('message').nullable();
    t.dateTime('createdat').notNull();
    t.dateTime('updatedat').nullable();
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('invitation');
};
