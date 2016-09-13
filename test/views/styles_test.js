'use strict'

const app = require('../../app')

describe('GET /stylesheets/style.css', () => {

  it('is OK', () =>
    request(app)
      .get('/stylesheets/style.css')
      .then(res => { expect(res).to.have.status(200) }))

  it('is CSS', () =>
    request(app)
      .get('/stylesheets/style.css')
      .then((res)=> {
        expect(res).to.have.status(200)
        expect(res).to.have.header('content-type', /^text\/css/)
        expect(res.text.length).to.be.above(0)
      }))

})
