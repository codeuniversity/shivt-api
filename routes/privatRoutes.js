'use strict';

const express = require( 'express' );
const router = express.Router();

const testRoutes = require( './test' );
router.use( '/test', testRoutes );

module.exports = router;
