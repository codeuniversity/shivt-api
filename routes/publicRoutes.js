'use strict'

const express = require( 'express' )
const router = express.Router()

const loginRoutes = require( './public/login' )
const signupRoutes = require( './public/signup' )
const eventsRoutes = require( './public/events' )
const talksRoutes = require( './public/talks' )
const speakersRoutes = require( './public/speakers' )
const sponsorsRoutes = require( './public/sponsors' )
const downloadRoutes = require( './public/download' )

router.get( '/', ( req, res ) => {
    res.send( 'Welcome to this awesome API!' )
})

router.use( '/login', loginRoutes )
router.use( '/signup', signupRoutes )
router.use( '/events', eventsRoutes )
router.use( '/events/:eventId/talks', talksRoutes )
router.use( '/events/:eventId/speakers', speakersRoutes )
router.use( '/events/:eventId/sponsors', sponsorsRoutes )

router.use( '/events/:eventId/download', downloadRoutes )

module.exports = router
