"use strict"

const errors = require( "../util/error_handling" );
const talksController = require('./talks');

function index( req, res ) {

    talksController.getTalks(req.params.eventId, (talks) => {
        res.json({'status': 'OK', 'talks': talks});
    })
}

module.exports = {
    index: index
};
