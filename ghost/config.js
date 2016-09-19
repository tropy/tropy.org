'use strict'

const { join } = require('path')

module.exports = {

  production: {
    url: 'https://tropy.org/blog',
    mail: {},
    database: {
      client: 'sqlite3',
      connection: {
        filename: join(__dirname, 'data/ghost.db')
      },
      debug: false
    },

    server: {
      host: '127.0.0.1',
      port: process.env.PORT || '8888'
    },

    paths: {
      contentPath: __dirname
    }
  },

  development: {
    url: 'http://localhost:8888/blog',

    database: {
      client: 'sqlite3',
      connection: {
        filename: join(__dirname, 'data/ghost-dev.db')
      },
      debug: false
    },

    server: {
      host: '127.0.0.1',
      port: '3000'
    },

    paths: {
      contentPath: __dirname
    }
  },
}
