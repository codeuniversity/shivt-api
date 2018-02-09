'use strict'

const errors = require('../util/error_handling')

function show (eventId, callback) {

  // TODO: Return ticketHash based on user access code

  global.datastore.get(global.datastore.key(['Event', parseInt(eventId)]))
    .then((results) => {
      callback({
        'name': results[0].name,
        'description': results[0].description,
        'startingDate': results[0].startingDate,
        'endingDate': results[0].endingDate,
        'location': results[0].location,
        'coordinates': results[0].coordinates,
        'primaryColor': results[0].primaryColor,
        'accentColor': results[0].accentColor
      })
    }).catch((err) => {
    errors.handle(err, res)
  })
}

module.exports = {
  'show': show
}
