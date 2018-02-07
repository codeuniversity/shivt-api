'use strict'

const errors = require( '../util/error_handling' );
const talksController = require('./talks');
const speakersController = require('./speakers');
const eventsController = require('./events');
const sponsorsController = require('./sponsors');

function index( req, res ) {

    res.json({'status': true})
}

module.exports = {
    index: index
};
