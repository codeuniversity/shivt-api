'use strict'
const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const bodyParser = require('body-parser')
const morgan = require('morgan')
const config = require('config')
const ev = require('express-validation')

const routes = require('./routes')
const log = require('./util/log')
const errors = require('./util/error_handling')

global.datastore = require('@google-cloud/datastore')({
  projectId: config.get('datastore.projectId'),
  keyFilename: config.get('datastore.keyFilename')
})

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

// Logging (debug only)
app.use(morgan('combined', {stream: {write: msg => log.info(msg)}}))

// Routes
app.use('/', routes)

// Validate Error Handling
app.use((err, req, res, next) => {
  if (err instanceof ev.ValidationError) res.json(errors.getErrorJSON('validation', err.errors))
})

app.listen(port)

log.info('-·-·-·-·-·-·-·-·-·-·-·-·-·-·-·-·-·-·-·-·-·-·-')
log.info(`🌐  API listening on port ${port}`)
log.info('-·-·-·-·-·-·-·-·-·-·-·-·-·-·-·-·-·-·-·-·-·-·-')
