exports.up = function(knex, Promise) {
  return knex.schema.createTable('channel', function(t) {
    t.increments().primary();
    t.string('name').notNull().unique();
    t.integer('creatorid').notNull().references('user.id').onDelete('CASCADE');
    t.boolean('private').notNull().defaultTo(false);
    t.dateTime('createdat').notNull();
    t.dateTime('updatedat').nullable();
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('channel');
};
