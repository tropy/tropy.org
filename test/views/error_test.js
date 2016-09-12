'use strict'


const app = require('../../app')

describe('Not Found', () => {

  it('is 404', () =>
    request(app).get('/not-here')
      .then(null, res => { expect(res).to.have.status(404) }))

})
