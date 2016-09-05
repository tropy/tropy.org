'use strict'

const express = require('express')
const { join, resolve } = require('path')
const njk = require('nunjucks')
const routes = require('./routes/index')

const app = express()

const paths = {
  assets: resolve(__dirname, 'assets'),
  public: resolve(__dirname, 'public'),
  twbs: resolve(__dirname, 'node_modules', 'bootstrap-sass', 'assets')
}

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
    src: paths.assets,
    dest: paths.public,
    includePaths: [
      join(paths.twbs, 'stylesheets')
    ],
    outputStyle: 'compressed',
    indentedSyntax: false,
    debug: (app.get('env') === 'development'),
    sourceMap: true
  }))

  .use(express.static(paths.public))
  .use('/images', express.static(join(paths.assets, 'images')))
  .use('/fonts', express.static(join(paths.assets, 'fonts')))

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
