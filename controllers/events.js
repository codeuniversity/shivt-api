'use strict'

const errors = require('../util/error_handling')

function show (eventId, callback) {
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

function create (req, res) {
  const entity = {
    key: global.datastore.key('Event'),
    data: {
      name: req.body.name,
      description: req.body.description,
      location: req.body.location,
      startingDate: new Date(req.body.startingDate),
      endingDate: new Date(req.body.endingDate)
    }
  }
  global.datastore.insert(entity).then((results) => {
    console.log(results)
    res.json({'status': true, 'projectId': results[0].mutationResults[0].key.path[0].id})
  })
}

module.exports = {
  'show': show,
  'create': create
}
