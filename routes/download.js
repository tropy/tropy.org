'use strict'

const express = require('express')
const api = express.Router()
const versions = require('../versions')

const GITHUB = 'https://github.com/tropy/tropy/releases/download'

function getAssetFolder(version) {
  return `${GITHUB}/${version}`
}

function getAssetUrl(version, platform, arch, variant) {
  if (arch !== 'x64') return null
  const folder = getAssetFolder(version)

  switch (platform) {
  case 'darwin':
    return (variant === 'zip') ?
      `${folder}/tropy-${version}-darwin.zip` :
      `${folder}/tropy-${version}.dmg`
  case 'linux':
    return `${folder}/tropy-${version}-${arch}.tar.bz2`
  case 'win32':
    return `${folder}/setup-tropy-${version}-${arch}.exe`
  default:
    return null
  }
}

const url = [
  '(/:channel(beta|dev|stable))?',
  '/:platform(darwin|linux|win32)',
  '(/:arch(x32|x64))?'
].join('')

const variants = {
  darwin: 'dmg', linux: '', win32: ''
}


api.get(`${url}(/:version)?`, (req, res, next) => {
  const channel = req.params.channel || 'stable'
  const arch = req.params.arch || 'x64'
  const platform = req.params.platform
  const version = req.params.version || versions[channel][0]
  const variant = variants[platform]

  const exists = (-1 !== versions[channel].indexOf(version))
  const url = exists && getAssetUrl(version, platform, arch, variant)

  if (url) return res.redirect(url)

  const err = new Error('This version of Tropy does not exist!')
  err.status = 404
  next(err)
})

module.exports = {
  api,
  url,
  getAssetFolder,
  getAssetUrl
}
