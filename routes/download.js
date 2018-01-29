"use strict"

const express = require( "express" );
const downloadController = require( "../controllers/download" );

let router = express.Router({mergeParams: true});

router.get( "/", downloadController.index );

module.exports = router;
