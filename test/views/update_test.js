'use strict'

const app = require('../../app')
const versions = require('../../versions')

describe('GET /update/(:channel/):platform/:version', () => {
  it('no content to latest version', () =>
    request(app)
      .get(`/update/beta/darwin/${versions.beta[0]}`)
      .then(res => { expect(res).to.have.status(204) }))

})

