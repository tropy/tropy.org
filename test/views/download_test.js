'use strict'

const app = require('../../app')

describe('GET /download/(:channel/):platform/:version', () => {
  it('redirects for existing versions', () =>
    request(app)
      .get('/download/beta/darwin/1.0.0-beta.11')
      .then(res => { expect(res).to.have.status(200) }))

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
})
