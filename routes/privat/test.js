'use strict'

const express = require( 'express' )
const testController = require( '../../controllers/test' )

let router = express.Router({mergeParams: true})

router.get( '/', testController.index )

module.exports = router
