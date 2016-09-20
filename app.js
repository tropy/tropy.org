'use strict'

const express = require('express')
const { join, resolve } = require('path')
const hbs = require('express-hbs')
const routes = require('./routes/index')

const app = express()

const paths = {
  assets: resolve(__dirname, 'assets'),
  public: resolve(__dirname, 'public'),
  views: resolve(__dirname, 'views'),
  ghost: resolve(__dirname, 'ghost', 'themes', 'tropy'),
  twbs: resolve(__dirname, 'node_modules', 'bootstrap-sass', 'assets')
}

app
  .engine('hbs', hbs.express4({
    partialsDir: [
      join(paths.views, 'partials'),
      join(paths.ghost, 'partials'),
    ],
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

  .use('/blog', (req, res, next) => {
    req.ghost = true
    next()
  })


switch (app.get('env')) {
case 'production':
  app.use(require('morgan')('combined'))

  try {
    app.locals.ga = require('./config').analytics.google
  } catch (_) {
    // Ignore missing config!
  }

  break

case 'development':
  app.use(require('morgan')('dev'))
  break
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
