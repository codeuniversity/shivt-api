'use strict'

const express = require( 'express' )
const eventController = require( '../../controllers/events' )

let router = express.Router()

router.get( '/:eventId', eventController.show )
router.get('/', eventController.index )

module.exports = router
