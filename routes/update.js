'use strict'

const express = require('express')
const api = module.exports = express.Router()
const versions = require('../versions')
const download = require('./download')

const variants = {
  darwin: 'zip', linux: '', win32: ''
}

const CHANNEL = '/:channel(dev|beta|stable)'
const PLATFORM = '/:platform(darwin|linux|win32)'

api.get(`${CHANNEL}${PLATFORM}(/:version)(/:file)?`, (req, res) => {
  const channel = req.params.channel || 'stable'
  const arch = req.params.arch || 'x64'
  const platform = download.getPlatform(req)
  const version = req.params.version
  const variant = variants[platform]
  const file = req.params.file

  if (file != null && platform === 'win32') {
    const url = download.getAssetFolder(versions[channel][0])

    if (url && (isReleases(file) || isPkg(file))) {
      return res.redirect(`${url}/${file}`)
    }

    res.status(404).send('Not Found')

  } else if (versions[channel].indexOf(version) > 0) {
    const name = versions[channel][0]
    const url = download.getAssetUrl(name, platform, arch, variant)

    if (url) return res.status(200).json({ url, name })
  }

  res.status(204).send('No Content')
})

const isReleases = (file) => (file === 'RELEASES')
const isPkg = (file) => ((/tropy-\d.+\.nupkg/).test(file))

module.exports = {
  api
}
