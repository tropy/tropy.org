'use strict'

const app = require('../../app')
const versions = require('../../versions')
const route = require('../support/route')

describe('GET /download/(:channel/):platform/:version', () => {
  it('redirects for existing versions', () =>
    request(app)
      .get('/download/beta/darwin/1.0.0-beta.11')
      .redirects(0)
      .then(route.unreachable, res =>
        expect(res).to.have.status(302)))

  it('not found for non-existing versions', () =>
    request(app)
      .get('/download/darwin/1.0.0')
      .then(route.unreachable, res =>
        expect(res).to.have.status(404)))

  it('not found for bad versions', () =>
    request(app)
      .get('/download/darwin/x.0.0')
      .then(route.unreachable, res =>
        expect(res).to.have.status(404)))

  it('not found for bad platform', () =>
    request(app)
      .get('/download/osx/1.0.0')
      .then(route.unreachable, res =>
        expect(res).to.have.status(404)))

  it('defaults to latest version', () =>
    request(app)
      .get('/download/beta/linux')
      .redirects(0)
      .then(route.unreachable, err => {
        expect(err.response).to.redirectTo(
          `https://github.com/tropy/tropy/releases/download/${versions.beta[0]}/tropy-${versions.beta[0]}-x64.tar.bz2`
        )
      }))

  it('resolves platform aliases', () =>
    request(app)
      .get('/download/beta/mac')
      .redirects(0)
      .then(route.unreachable, res =>
        expect(res).to.have.status(302)))

  it('resolves platform aliases', () =>
    request(app)
      .get('/download/beta/windows')
      .redirects(0)
      .then(route.unreachable, res =>
        expect(res).to.have.status(302)))
})
