'use strict'

module.exports = shipit => {
  require('shipit-deploy')(shipit)

  const { deploy } = require('./config.json')

  shipit.initConfig({
    default: {
      workspace: 'tmp',
      deployTo: deploy.path,
      repositoryUrl: 'https://github.com/tropy/tropy.org.git',
      ignores: [
        '.config.enc',
        '.eslintrc',
        '.git',
        '.gitignore',
        '.key.enc',
        '.travis.yml',
        'README.md',
        'shipitfile.js',
        'test'
      ],
      keepReleases: 2,
      shallowClone: true
    },

    production: {
      servers: `${deploy.user}@${deploy.host}`
    }
  })
}
