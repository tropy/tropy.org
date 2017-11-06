'use strict'

const express = require('express')
const api = module.exports = express.Router()
const download = require('./download')

const onHeaders = require('on-headers')

const VERSIONS = require('../versions')
const RELEASES = require('../releases')

RELEASES.x64.stable = RELEASES.x64.stable.join('\r\n')
RELEASES.x64.beta = RELEASES.x64.beta.join('\r\n')
RELEASES.x32.stable = RELEASES.x32.stable.join('\r\n')
RELEASES.x32.beta = RELEASES.x32.beta.join('\r\n')


const variants = {
  darwin: 'zip', linux: '', win32: ''
}

const CHANNEL = '(/:channel(dev|beta|stable))'
const ARCH = '(/:arch(x32|x64))?'
const PLATFORM = '(/:platform(darwin|linux))'


function noCache(res) {
  onHeaders(res, function () { this.removeHeader('ETag') })
  return res
}

// Linux and macOS
api.get(`${CHANNEL}${PLATFORM}${ARCH}/:version`, (req, res) => {
  const channel = req.params.channel || 'stable'
  const arch = req.params.arch || 'x64'
  const platform = req.params.platform
  const version = req.params.version
  const variant = variants[platform]

  if (VERSIONS[channel].indexOf(version) > 0) {
    const name = VERSIONS[channel][0]
    const url = download.getAssetUrl(name, platform, arch, variant)
    const notes = download.getAssetFolder(name)

    if (url) return noCache(res).status(200).json({ url, name, notes })
  }

  res.status(204).end()
})


api.get(`${CHANNEL}/win32/RELEASES`, winReleases)
api.get(`${CHANNEL}/win32/:file`, winPackage)

// Windows Legacy Routes (1.0.0)
api.get(`${CHANNEL}/win32/:version/RELEASES`, winReleases)
api.get(`${CHANNEL}/win32/:version/:file`, winPackage)


function winReleases(req, res) {
  const channel = req.params.channel || 'stable'
  const arch = req.params.arch || 'x64'
  const releases = RELEASES[arch][channel]

  if (releases == null || releases.length === 0) {
    return res.status(204).end()
  }

  res
    .status(200)
    .set('Content-Type', 'application/octet-stream')
    .set('Content-Length', Buffer.byteLength(releases, 'utf8'))
    .send(releases)
}

function winPackage(req, res) {
  const channel = req.params.channel || 'stable'
  //const arch = req.params.arch || 'x64'
  const file = req.params.file
  const match = file.match(NUPKG)

  if (match != null) {
    const version = match[3].replace(/(beta|dev|rc)/, '$1.')

    if (VERSIONS[channel].indexOf(version) !== -1) {
      const url = download.getAssetFolder(version)
      if (url != null) return res.redirect(`${url}/${file}`)
    }
  }

  res.status(404).send('Not Found')
}

const NUPKG =
  /^tropy(-(beta|dev))?-(\d+\.\d+.\d+(-(beta|rc|dev)\d+)?)-(delta|full)\.nupkg$/

module.exports = {
  api
}
