'use strict'

const app = require('../../app')
const versions = require('../../versions')

describe('GET /update/(:channel/):platform/:version', () => {
  it('no content to latest version', () =>
    request(app)
      .get(`/update/beta/darwin/${versions.beta[0]}`)
      .then(res => { expect(res).to.have.status(204) }))

  describe('when an update is available', () => {
    beforeEach(() =>
      void versions.beta.unshift('LATEST'))
    afterEach(() =>
      void versions.beta.shift())

    it('returns an update resposnse', () =>
      request(app)
        .get(`/update/beta/darwin/${versions.beta[1]}`)
        .then(res => {
          expect(res).to.have.status(200)
          expect(res.body).to.eql({
            url: 'https://github.com/tropy/tropy/releases/download/LATEST/tropy-LATEST.dmg',
            name: 'LATEST'
          })
        }))
  })
})
