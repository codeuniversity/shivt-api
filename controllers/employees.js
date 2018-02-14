'use strict'

const errors = require('../util/error_handling')
const randomstring = require("randomstring")

function show (eventId, callback) {
  global.datastore.get(global.datastore.key(['Employee', parseInt(eventId)]))
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
  let inviteCode = randomstring.generate({
    length: 6,
    charset: 'alphanumeric'
  })
  const entity = {
    key: global.datastore.key('Employee'),
    data: {
      name: req.body.name,
      gender: req.body.gender,
      mail: req.body.mail,
      phone: req.body.phone,
      invitecode: inviteCode
    }
  }
  global.datastore.insert(entity).then((results) => {
    res.json({'status': true, 'employeeId': results[0].mutationResults[0].key.path[0].id, 'invitecode': inviteCode})
  })
}

function update (req, res) {
  global.datastore.get(global.datastore.key(['Employee', parseInt(req.body.id)])) .then((event) => {
    if(event[0]){
      const entity = {
        key: global.datastore.key(['Employee', parseInt(req.body.id)]),
        data: {
          name: req.body.name,
          gender: req.body.gender,
          mail: req.body.mail,
          phone: req.body.phone
        }
      }
      global.datastore.update(entity).then(() => {
        res.json({'status': true})
      })
    }else{
      errors.output('event_not_exist', 'event does not exist', res)
    }
  })
}

module.exports = {
  'show': show,
  'create': create,
  'update': update
}
