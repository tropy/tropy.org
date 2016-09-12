'use strict'

const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
  res.render('index', {
    path: req.path,
    title: 'Tropy'
  })
})

router.get('/terms-of-service', (req, res) => {
  res.render('terms-of-service', {
    path: req.path,
    layout: 'index.njk',
    title: 'Tropy · Terms of Service'
  })
})


module.exports = router
