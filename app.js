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

njk.configure(['views', 'public'], {
  autoescape: true,
  watch: (app.get('env') === 'development'),
  express: app
})

app
  .set('view engine', 'njk')

  .use(require('compression')())
  .use(require('serve-favicon')(join(paths.public, 'favicon.ico')))

  .use((req, res, next) => {
    res.locals.track = !req.headers.dnt
    next()
  })

  .all('/blog*', (req, res, next) => {
    req.ghost = true
    next()
  })


try {
  app.locals.ga = require('./config').analytics.google

} catch (_) {
  // Ignore missing config!
}


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

  .use((req, res, next) => {
    // Let Ghost handle it!
    if (req.ghost) return next()

    // Catch 404
    const err = new Error('You took a wrong turn! Follow the thread back to safety.')
    err.status = 404
    next(err)
  })


// Error Handlers

if (app.get('env') === 'development') {
  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    res.status(err.status || 500)
    res.render('error', {
      title: `${err.status || 500} ${err.message}`,
      layout: 'index.njk',
      message: err.message,
      error: err
    })
  })
}

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  res.status(err.status || 500)
  res.render('error', {
    layout: 'index.njk',
    title: `${err.status || 500} ${err.message}`,
    message: err.message,
    error: {}
  })
})


module.exports = app
