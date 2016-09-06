'use strict'


const app = require('../../app')
const validate = require('html-validator')

describe('GET /', () => {

  it('is OK', () =>
    request(app).get('/')
      .then(res => { expect(res).to.have.status(200) }))

  it('is HTML', () =>
    request(app).get('/')
      .then(res => { expect(res).to.be.html }))

  it('is valid', function (done) {
    this.timeout(10000)

    request(app).get('/')
      .then(({ text: data })=> {
        expect(data).to.have.string('</html>')

        validate({ data }, (err, res) => {
          expect(err).not.to.exist

          expect(JSON.parse(res))
            .to.have.property('messages')
            .and.eql([])

          done()
        })
      }, done)
  })

})
