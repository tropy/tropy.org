'use strict'

const express = require('express')
const api = express.Router()
const versions = require('../versions')

const GITHUB = 'https://github.com/tropy/tropy/releases/download'

function getAssetUrl(version, platform, arch) {
  if (arch !== 'x64') return null

  switch (platform) {
  case 'darwin':
    return `${GITHUB}/${version}/tropy-${version}.dmg`
  case 'linux':
    return `${GITHUB}/${version}/tropy-${version}-${arch}.tar.bz2`
  case 'win32':
    return `${GITHUB}/${version}/setup-tropy-${version}-${arch}.exe`
  default:
    return null
  }
}

function getReleasesUrl(version) {
  return `${GITHUB}/${version}/RELEASES`
}


const url = [
  '(/:channel(beta|dev|stable))?',
  '/:platform(darwin|linux|win32)',
  '(/:arch(x32|x64))?'
].join('')


api.get(`${url}(/:version)?`, (req, res, next) => {
  const channel = req.params.channel || 'stable'
  const arch = req.params.arch || 'x64'
  const platform = req.params.platform
  const version = req.params.version || versions[channel][0]

  const exists = (-1 !== versions[channel].indexOf(version))
  const url = exists && getAssetUrl(version, platform, arch)

  if (url) return res.redirect(url)

  const err = new Error('This version of Tropy does not exist!')
  err.status = 404
  next(err)
})

module.exports = {
  api,
  url,
  getAssetUrl,
  getReleasesUrl
}
