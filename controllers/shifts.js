'use strict'

const helpers = require("../util/helpers")

function index(req, res) {

  global.datastore.runQuery(global.datastore.createQuery('Shift').hasAncestor(datastore.key(['Event', parseInt(req.params.eventId)])), (err, tmp_shifts) => {
    processShifts(err, tmp_shifts, (shifts) => {
      res.json({'status': true, 'shifts': shifts})
    })
  })

}

function show(req, res) {

  global.datastore.get(global.datastore.key(['Event', parseInt(req.params.eventId), 'Shift', parseInt(req.params.shiftId)]), (err, tmp_shift) => {
    processShifts(err, tmp_shift, (shift) => {
      res.json({'status': true, 'shift': shift})
    })
  })

}

function create(req, res) {
  const entity = {
    key: global.datastore.key(['Event', req.params.eventId, 'Shift']),
    data: {
      name: req.body.name,
      description: req.body.description,
      startingDate: new Date(req.body.startingDate),
      endingDate: new Date(req.body.endingDate),
      preferredGender: req.body.preferredGender,
      meetingPoint: req.body.meetingPoint,
      contactId: global.datastore.key(['Event', req.params.eventId, 'Shift', req.body.contactId])
    }
  }
  global.datastore.insert(entity).then((results) => {
    res.json({'status': true, 'id': results[0].mutationResults[0].key.path[1].id})
  })
}

function processShifts(err, tmp_shifts, callback) {
  if (!Array.isArray(tmp_shifts)) {
    tmp_shifts = [tmp_shifts]
  }
  let contact, shifts
  shifts = []
  tmp_shifts.forEach((tmp_shift) => {
    if (err) {
      //handle errors
    }
      let skills = [];
    global.datastore.get(tmp_shift.contactId, (err, tmp_contact) => {
      contact = helpers.contactSerializer(tmp_contact)
      helpers.findInRelationalEntity(
        tmp_shift[global.datastore.KEY],
        '_ShiftSkill',
        (tmp_skills) => {
          tmp_skills.forEach((tmp_skill) => {
            skills.push(helpers.skillSerializer(tmp_skill))
            if (skills.length === tmp_skills.length) {
              helpers.sortByDay(shifts, helpers.shiftSerializer(tmp_shift, helpers.sortByKey(skills, 'name'), contact), 'shifts')
              if (shifts.length === tmp_shifts.length) {
                shifts.forEach(function (day) {
                  helpers.sortByKey(day.shifts, 'startingDate');
                })
                helpers.sortByKey(shifts, 'date');
                callback(shifts)
              }
            }
          })
        })
    })
  })
}

module.exports = {
  index: index,
  show: show,
  'create': create,
  'update': update
}
