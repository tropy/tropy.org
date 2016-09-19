'use strict'

const express = require('express')
const { join, resolve } = require('path')
const hbs = require('express-hbs')
const routes = require('./routes/index')

try {
  var analytics = require('./config').analytics
} catch (_) {
  // Ignore missing config...
  analytics = {}
}

const app = express()

const paths = {
  assets: resolve(__dirname, 'assets'),
  public: resolve(__dirname, 'public'),
  views: resolve(__dirname, 'views'),
  twbs: resolve(__dirname, 'node_modules', 'bootstrap-sass', 'assets')
}

app
  .engine('hbs', hbs.express4({
    partialsDir: join(paths.views, 'partials'),
    layoutsDir: join(paths.views, 'layouts'),
    defaultLayout: join(paths.views, 'layouts', 'default.hbs')
  }))

  .set('view engine', 'hbs')
  .set('views', paths.views)

  .use(require('compression')())
  .use(require('serve-favicon')(join(paths.public, 'favicon.ico')))

  .use((req, res, next) => {
    res.locals.track = !req.headers.dnt && app.locals.ga
    next()
  })

app.locals.ga = analytics.google

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
      message: err.message,
      error: err
    })
  })
}

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  res.status(err.status || 500)
  res.render('error', {
    title: `${err.status || 500} ${err.message}`,
    message: err.message,
    error: {}
  })
})


module.exports = app
