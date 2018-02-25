'use strict'

const express = require('express')
const router = express.Router()

const testRoutes = require('./privat/test')
const eventRoutes = require('./privat/events')
const employeesRoutes = require('./privat/employees')
const shiftsRoutes = require('./privat/shifts')
const skillsRoutes = require('./privat/skills')

router.use('/test', testRoutes)
router.use('/events', eventRoutes)
router.use('/events/:eventId/employees', employeesRoutes)
router.use( '/events/:eventId/shifts', shiftsRoutes )
router.use( '/events/:eventId/skills', skillsRoutes )

module.exports = router
