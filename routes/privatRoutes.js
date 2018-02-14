'use strict'

const express = require('express')
const router = express.Router()

const testRoutes = require('./privat/test')
const eventRoutes = require('./privat/events')
const employeesRoutes = require('./privat/employees')

router.use('/test', testRoutes)
router.use('/events', eventRoutes)
router.use('/employees', employeesRoutes)

module.exports = router
