'use strict'


describe('GET /', () => {
  const app = require('../../app')

  it('is OK', () =>
    request(app).get('/')
      .then(res => { expect(res).to.have.status(200) }))

  it('is HTML', () =>
    request(app).get('/')
      .then(res => { expect(res).to.be.html }))

})
