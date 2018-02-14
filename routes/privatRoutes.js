'use strict'

const express = require('express')
const router = express.Router()

const testRoutes = require('./privat/test')
const eventRoutes = require('./privat/events')

router.use('/test', testRoutes)
router.use('/events', eventRoutes)

module.exports = router
