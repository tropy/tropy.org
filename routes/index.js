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
    title: 'Tropy · Terms of Service'
  })
})

router.get('/credits', (req, res) => {
  res.render('credits', {
    path: req.path,
    title: 'Tropy · Credits'
  })
})

router.get('/license', (req, res) => {
  res.render('license', {
    path: req.path,
    title: 'Tropy · License'
  })
})


module.exports = router
