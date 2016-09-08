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
        '.priv.tar.enc',
        '.eslintrc',
        '.git',
        '.gitignore',
        '.travis.yml',
        'README.md',
        'shipitfile.js',
        'test'
      ],
      rsync: ['--del'],
      key: deploy.key,
      keepReleases: 2,
      shallowClone: true
    },

    production: {
      servers: `${deploy.user}@${deploy.host}`,
      npm: {
        args: '--production --silent'
      }
    }
  })

  shipit.blTask('npm', () =>
    shipit
      .remote([
        `cd ${shipit.releasePath}`,
        'source ~/.bash_profile',
        'node -v',
        `npm install ${shipit.config.npm.args}`

      ].join(' && '))
      .then(() => {
        shipit.log('NPM modules installed successfully.')
      }))

  shipit.blTask('pm2', () =>
    shipit
      .remote([
        `cd ${shipit.config.deployTo}`,
        'source ~/.bash_profile',
        'node -v',
        'pm2 startOrRestart proc.json'

      ].join(' && '))
      .then(() => {
        shipit.log('PM2 restarted.')
      }))

  shipit.on('updated', () => {
    shipit.start('npm')
  })

  shipit.on('cleaned', () => {
    shipit.start('pm2')
  })
}
