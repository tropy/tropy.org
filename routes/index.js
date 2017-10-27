'use strict'

const express = require('express')
const router = express.Router()
const download = require('./download')
const update = require('./update')

router.get('/', (req, res) => {
  res.render('index', {
    path: req.path,
    title: 'Tropy',
    page: 'home'
  })
})

router.get('/terms-of-service', (req, res) => {
  res.render('terms-of-service', {
    path: req.path,
    title: 'Tropy · Terms of Service',
    page: 'terms'
  })
})

router.get('/credits', (req, res) => {
  res.render('credits', {
    path: req.path,
    title: 'Tropy · Credits',
    page: 'credits'
  })
})

router.get('/license', (req, res) => {
  res.render('license', {
    path: req.path,
    title: 'Tropy · License',
    page: 'license'
  })
})

router.use('/download', download.api)
router.use('/update', update.api)


module.exports = router
