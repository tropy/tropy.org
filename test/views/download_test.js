'use strict'

const app = require('../../app')
const versions = require('../../versions')

describe('GET /download/(:channel/):platform/:version', () => {
  it('redirects for existing versions', () =>
    request(app)
      .get('/download/beta/darwin/1.0.0-beta.11')
      .redirects(0)
      .then(null, res => { expect(res).to.have.status(302) }))

  it('not found for non-existing versions', () =>
    request(app)
      .get('/download/darwin/1.0.0')
      .then(null, res => { expect(res).to.have.status(404) }))

  it('not found for bad versions', () =>
    request(app)
      .get('/download/darwin/x.0.0')
      .then(null, res => { expect(res).to.have.status(404) }))

  it('not found for bad platform', () =>
    request(app)
      .get('/download/mac/1.0.0')
      .then(null, res => { expect(res).to.have.status(404) }))

  it('defaults to latest version', () =>
    request(app)
      .get('/download/beta/linux')
      .redirects(0)
      .then(null, err => {
        expect(err.response).to.redirectTo(
          `https://github.com/tropy/tropy/releases/download/${versions.beta[0]}/tropy-${versions.beta[0]}-x64.tar.bz2`
        )
      }))

})
