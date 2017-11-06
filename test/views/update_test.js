'use strict'

const app = require('../../app')
const versions = require('../../versions')
const route = require('../support/route')

describe('GET /update/(:channel/):platform/:version', () => {
  it('no content for latest mac release', () =>
    request(app)
      .get(`/update/stable/darwin/${versions.stable[0]}`)
      .then(res => { expect(res).to.have.status(204) }))
  it('OK for previous mac release', () =>
    request(app)
      .get(`/update/stable/darwin/${versions.stable[1]}`)
      .then(res => { expect(res).to.have.status(200) }))
  it('no content for latest linux release', () =>
    request(app)
      .get(`/update/stable/linux/${versions.stable[0]}`)
      .then(res => { expect(res).to.have.status(204) }))
  it('no content for latest linux x32 release', () =>
    request(app)
      .get(`/update/stable/linux/x32/${versions.stable[0]}`)
      .then(res => { expect(res).to.have.status(204) }))

  it('no content for latest mac beta', () =>
    request(app)
      .get(`/update/beta/darwin/${versions.beta[0]}`)
      .then(res => { expect(res).to.have.status(204) }))
  it('no content for latest mac beta', () =>
    request(app)
      .get(`/update/beta/linux/${versions.beta[0]}`)
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
            notes: 'https://github.com/tropy/tropy/releases/download/LATEST',
            name: 'LATEST'
          })
        }))
  })
})


describe('GET /update/(:channel/)win32/:version/RELEASES', () => {
  it('is OK for 1.0.0', () =>
    request(app)
      .get('/update/stable/win32/1.0.0/RELEASES')
      .then((res) => {
        expect(res).to.have.status(200)
      }, route.unreachable))
  it('is OK for 1.0.0-beta.16', () =>
    request(app)
      .get('/update/beta/win32/1.0.0-beta.16/RELEASES')
      .then((res) => {
        expect(res).to.have.status(200)
      }, route.unreachable))
})


describe('GET /update/(:channel/)win32/:version/:pkg', () => {
  it('redirects for good package names for 1.0.0', () =>
    request(app)
      .get('/update/stable/win32/1.0.0/tropy-1.0.0-full.nupkg')
      .redirects(0)
      .then(route.unreachable, res =>
        expect(res).to.have.status(302)))
  it('redirects for good package names for beta.16', () =>
    request(app)
      .get('/update/beta/win32/1.0.0-beta.16/tropy-beta-1.0.0-beta16-delta.nupkg')
      .redirects(0)
      .then(route.unreachable, res =>
        expect(res).to.have.status(302)))
  it('not found for bad package names', () =>
    request(app)
      .get('/update/stable/win32/1.0.0-rc.1/tropy-beta-1.0.0-rc1-full.dmg')
      .then(route.unreachable, res =>
        expect(res).to.have.status(404)))
})

describe('GET /update/(:channel/)win32/RELEASES', () => {
  it('is OK', () =>
    request(app)
      .get('/update/stable/win32/RELEASES')
      .then((res) => {
        expect(res).to.have.status(200)
      }, route.unreachable))
})

describe('GET /update/(:channel/)win32/:pkg', () => {
  it('redirects for good package names', () =>
    request(app)
      .get('/update/stable/win32/tropy-1.0.1-full.nupkg')
      .redirects(0)
      .then(route.unreachable, res =>
        expect(res).to.have.status(302)))
  it('not found for bad package names', () =>
    request(app)
      .get('/update/stable/win32/tropy-beta-1.0.0-rc1-full.dmg')
      .then(route.unreachable, res =>
        expect(res).to.have.status(404)))
})
