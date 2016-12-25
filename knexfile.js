'use strict';

module.exports = {
  test: {
    client: 'pg',
    connection: {
      database: 'plonktest',
      user:     'postgres',
      password: ''
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: 'db/migrations'
    },
    seeds: { directory: 'db/seeds' }
  },

  development: {
    client: 'pg',
    connection: {
      database: 'plonkdev',
      user:     'postgres',
      password: ''
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: 'db/migrations'
    },
    seeds: { directory: 'db/seeds' }
  },

  staging: {
    client: 'pg',
    connection: {
      port: process.env.DB_PORT,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      user:     process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: 'db/migrations'
    },
    seeds: { directory: 'db/seeds' }
  },

  production: {
    client: 'pg',
    connection: {
      port: process.env.DB_PORT,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      user:     process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: 'db/migrations'
    },
    seeds: { directory: 'db/seeds' }
  }
};
