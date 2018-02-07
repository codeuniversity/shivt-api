'use strict'

const express = require( 'express' );
const loginController = require( '../controllers/login' );

let router = express.Router();

router.post( '/', loginController.login );

module.exports = router;
