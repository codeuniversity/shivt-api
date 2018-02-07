'use strict'

const errors = require( '../util/error_handling' );
const talksController = require('./talks');
const speakersController = require('./speakers');
const eventsController = require('./events');
const sponsorsController = require('./sponsors');

function index( req, res ) {

    talksController.getTalks(req.params.eventId, (talks) => {
      speakersController.getSpeakers(req.params.eventId, (speakers) => {
        eventsController.show(req.params.eventId, (event) => {
          sponsorsController.getSponsors(req.params.eventId, (sponsors) => {
            res.json({'status': true, 'event': event, 'talks': talks, 'speakers': speakers, 'sponsors': sponsors})
          })
        })
      })
    })
}

module.exports = {
    index: index
};
