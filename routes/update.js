'use strict'

const express = require('express')
const api = module.exports = express.Router()
const versions = require('../versions')
const download = require('./download')

const variants = {
  darwin: 'zip', linux: '', win32: ''
}

api.get(`${download.url}/:version`, (req, res) => {
  const channel = req.params.channel || 'stable'
  const arch = req.params.arch || 'x64'
  const platform = download.getPlatform(req)
  const version = req.params.version
  const variant = variants[platform]

  if (versions[channel].indexOf(version) > 0) {
    const name = versions[channel][0]
    const url = download.getAssetUrl(name, platform, arch, variant)

    if (url) return res.status(200).json({ url, name })
  }

  res.status(204).send('No Content')
})


api.get(`${download.url}/:file`, (req, res, next) => {
  const channel = req.params.channel || 'stable'
  const version = versions[channel][0]
  const file = req.params.file

  const url = version != null && download.getAssetFolder(version)

  if (url && (isReleases(file) || isPkg(file))) {
    return res.redirect(`${url}/${file}`)
  }

  const err = new Error('This version of Tropy does not exist!')
  err.status = 404
  next(err)
})

const isReleases = (nupkg) => (nupkg === 'RELEASES')
const isPkg = (nupkg) => ((/tropy-\d.+\.nupkg/).test(nupkg))

module.exports = {
  api
}
