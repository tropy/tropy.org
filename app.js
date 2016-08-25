'use strict'

const express = require('express')
const { join } = require('path')
const njk = require('nunjucks')
const routes = require('./routes/index')

const app = express()

njk.configure('views', {
  autoescape: true,
  express: app
})

app
  .set('view engine', 'njk')

  //.use(require('serve-favicon')(join(__dirname, 'public', 'favicon.ico')))

if (app.get('env') !== 'test') {
  app.use(require('morgan')('dev'))
}

app
  .use(require('node-sass-middleware')({
    src: join(__dirname, 'assets'),
    dest: join(__dirname, 'public'),
    indentedSyntax: true,
    sourceMap: true
  }))

  .use(express.static(join(__dirname, 'public')))

  .use('/', routes)

  // Catch 404
  .use((req, res, next) => {
    const err = new Error('Not Found')
    err.status = 404
    next(err)
  })


// Error Handlers

if (app.get('env') === 'development') {
  app.use((err, req, res) => {
    res.status(err.status || 500)
    res.render('error', {
      message: err.message,
      error: err
    })
  })
}

app.use((err, req, res) => {
  res.status(err.status || 500)
  res.render('error', {
    message: err.message,
    error: {}
  })
})


module.exports = app
