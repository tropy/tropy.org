'use strict'

const chai = require('chai')

chai.use(require('chai-as-promised'))
chai.use(require('chai-http'))

global.expect = chai.expect
global.request = chai.request
