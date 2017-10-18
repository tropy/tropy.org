'use strict'

const express = require('express')
const api = module.exports = express.Router()
const versions = require('../versions')
const download = require('./download')

api.get(`${download.url}/:version`, (req, res) => {
  const channel = req.params.channel || 'stable'
  const arch = req.params.arch || 'x64'
  const platform = req.params.platform
  const version = req.params.version

  if (versions[channel].indexOf(version) > 0) {
    const name = versions[channel][0]
    const url = download.getAssetUrl(name, platform, arch)

    if (url) return res.status(200).json({ url, name })
  }

  res.status(204).send('No Content')
})

api.get(`${download.url}/:version/RELEASES`, (req, res, next) => {
  const channel = req.params.channel || 'stable'
  const version = req.params.version

  const exists = (-1 !== versions[channel].indexOf(version))
  const url = exists && download.getReleasesUrl(version)

  if (url) return res.redirect(url)

  const err = new Error('This version of Tropy does not exist!')
  err.status = 404
  next(err)
})

module.exports = {
  api
}
