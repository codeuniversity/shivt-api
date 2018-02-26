'use strict'

const express = require('express')
const router = express.Router()

const testRoutes = require('./private/test')
const eventRoutes = require('./private/events')
const employeesRoutes = require('./private/employees')
const shiftsRoutes = require('./private/shifts')
const skillsRoutes = require('./private/skills')

router.use('/test', testRoutes)
router.use('/events', eventRoutes)
router.use('/events/:eventId/employees', employeesRoutes)
router.use( '/events/:eventId/shifts', shiftsRoutes )
router.use( '/events/:eventId/skills', skillsRoutes )

module.exports = router
