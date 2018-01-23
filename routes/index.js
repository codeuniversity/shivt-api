"use strict";

const express = require( "express" );
const router = express.Router();

const eventsRoutes = require( "./events" );
const talksRoutes = require( "./talks" );
const speakersRoutes = require( "./speakers" );

router.get( "/", ( req, res ) => {
    res.send( "Welcome to this awesome API!" );
} );

router.use( "/events", eventsRoutes );
router.use( "/events/:eventId/talks", talksRoutes );
router.use( "/events/:eventId/speakers", speakersRoutes );

module.exports = router;
