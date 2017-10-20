'use strict'


const app = require('../../app')
const route = require('../support/route')

describe('Not Found', () => {
  it('is 404', () =>
    request(app).get('/not-here')
      .then(route.unreachable, res =>
        expect(res).to.have.status(404)))
})
