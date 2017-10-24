'use strict'

const app = require('../../app')
const versions = require('../../versions')
const route = require('../support/route')

describe('GET /update/(:channel/):platform/:version', () => {
  it('no content for latest release', () =>
    request(app)
      .get(`/update/stable/darwin/${versions.stable[0]}`)
      .then(res => { expect(res).to.have.status(204) }))

  it('no content for latest beta', () =>
    request(app)
      .get(`/update/beta/darwin/${versions.beta[0]}`)
      .then(res => { expect(res).to.have.status(204) }))

  describe('when an update is available', () => {
    beforeEach(() =>
      void versions.stable.unshift('LATEST'))
    afterEach(() =>
      void versions.stable.shift())

    it('returns an update response', () =>
      request(app)
        .get(`/update/stable/darwin/${versions.stable[1]}`)
        .then(res => {
          expect(res).to.have.status(200)
          expect(res.body).to.eql({
            url: 'https://github.com/tropy/tropy/releases/download/LATEST/tropy-LATEST-darwin.zip',
            name: 'LATEST'
          })
        }))
  })
})

describe('GET /update/(:channel/):platform/:version/RELEASES', () => {
  it('redirects', () =>
    request(app)
      .get('/update/stable/win32/1.0.0-beta.13/RELEASES')
      .redirects(0)
      .then(route.unreachable, err =>
        expect(err.response).to.have.status(302)))
})

describe('GET /update/(:channel/):platform/:version/:pkg', () => {
  it('redirects for good package names', () =>
    request(app)
      .get('/update/stable/win32/1.0.0-rc.1/tropy-1.0.0-rc1-full.nupkg')
      .redirects(0)
      .then(route.unreachable, res =>
        expect(res).to.have.status(302)))

  it('not found for bad package names', () =>
    request(app)
      .get('/update/stable/win32/1.0.0-rc.1/tropy-beta-1.0.0-rc1-full.dmg')
      .then(route.unreachable, res =>
        expect(res).to.have.status(404)))
})
