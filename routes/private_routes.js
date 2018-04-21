'use strict'

const express = require('express')
const router = express.Router()

const eventRoutes = require('./private/events')
const employeesRoutes = require('./private/employees')
const shiftsRoutes = require('./private/shifts')
const skillsRoutes = require('./private/skills')

router.use('/events', eventRoutes)
router.use('/employees', employeesRoutes)
router.use( '/events/:eventId/shifts', shiftsRoutes )
router.use( '/skills', skillsRoutes )

module.exports = router
