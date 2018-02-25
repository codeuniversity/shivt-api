'use strict'

// todo: include attendance functions

const helpers = require("../util/helpers")
const errors = require('../util/error_handling');
const interchangeable_routes = require("../util/interchangeable_routes")

function index(req, res) {

  global.datastore.runQuery(global.datastore.createQuery('Shift').hasAncestor(datastore.key(['Event', parseInt(req.params.eventId)])), (err, tmp_shifts) => {
    processShifts(err, tmp_shifts, (shifts) => {
      res.json({'status': true, 'shifts': shifts})
    })
  })

}

function show(req, res) {

  global.datastore.get(global.datastore.key(['Event', parseInt(req.params.eventId), 'Shift', parseInt(req.params.shiftId)]), (err, tmp_shift) => {
    if (tmp_shift === undefined) {
      errors.output('shift_not_exist', 'shift does not exist', res)
    } else {
      processShifts(err, tmp_shift, (shift) => {
        res.json({'status': true, 'shift': shift[0]['shifts'][0]})
      })
    }
  })

}

function create(req, res) {
  const entity = {
    key: global.datastore.key(['Event', parseInt(req.params.eventId), 'Shift']),
    data: {
      name: req.body.name,
      description: req.body.description,
      startingDate: new Date(req.body.startingDate),
      endingDate: new Date(req.body.endingDate),
      preferredGender: req.body.preferredGender,
      meetingPoint: req.body.meetingPoint,
      contactId: global.datastore.key(['Event', parseInt(req.params.eventId), 'Employee', parseInt(req.body.contactId)])
    }
  }
  global.datastore.insert(entity).then((results) => {
    res.json({'status': true, 'id': results[0].mutationResults[0].key.path[1].id})
  })
}

function update(req, res) {
  const entity = {
    key: global.datastore.key(['Event', parseInt(req.params.eventId), 'Shift', parseInt(req.params.shiftId)]),
    data: {
      name: req.body.name,
      description: req.body.description,
      startingDate: new Date(req.body.startingDate),
      endingDate: new Date(req.body.endingDate),
      preferredGender: req.body.preferredGender,
      meetingPoint: req.body.meetingPoint,
      contactId: global.datastore.key(['Event', parseInt(req.params.eventId), 'Employee', parseInt(req.body.contactId)])
    }
  }
  global.datastore.update(entity, (err) => {
    if (err) {
      if (err.code === 5) {
        errors.output('shift_not_exist', 'shift does not exist', res)
      }
    }
    res.json({'status': true})
  })
}

function remove(req, res) {
  global.datastore.delete(global.datastore.key(['Event', parseInt(req.params.eventId), 'Shift', parseInt(req.params.shiftId)]), () => {
    res.json({'status': true})
  });
}

function addSkill(req, res) {
  helpers.insertRelation(
    '_ShiftSkill',
    global.datastore.key(['Event', parseInt(req.params.eventId), 'Shift', parseInt(req.params.shiftId)]),
    global.datastore.key(['Event', parseInt(req.params.eventId), 'Skill', parseInt(req.params.skillId)]),
    res,
    (result) => {
      if (result === true) {
        res.json({'status': true})
      }
    }
  )
}

function removeSkill(req, res) {
  global.datastore.runQuery(global.datastore.createQuery('_ShiftSkill')
      .filter('shift', global.datastore.key(['Event', parseInt(req.params.eventId), 'Shift', parseInt(req.params.shiftId)]))
      .filter('skill', global.datastore.key(['Event', parseInt(req.params.eventId), 'Skill', parseInt(req.params.skillId)])),
    (err, exists) => {
      if (exists.length === 0) {
        errors.output('relation_not_exist', 'relation does not exist', res)
      } else {
        global.datastore.delete(global.datastore.key(['Event', parseInt(req.params.eventId), '_ShiftSkill', parseInt(exists[0][global.datastore.KEY].id)]), () => {
          res.json({'status': true})
        })
      }
    })
}

function addEmployee(req, res) {

  interchangeable_routes.addShiftEmployee(req,res)

}

function removeEmployee(req, res) {

  interchangeable_routes.removeShiftEmployee(req, res)

}

function getEmployees(req, res) {

  let employees = []

  helpers.findInRelationalEntity(
    global.datastore.key(['Event', parseInt(req.params.eventId), 'Shift', parseInt(req.params.shiftId)]),
    '_ShiftEmployee',
    (tmp_employees) => {
      tmp_employees.forEach((tmp_employee) => {
        employees.push({
          'id': employee[global.datastore.KEY].id,
          'firstname': employee.firstname,
          'lastname': employee.lastname,
        })
      })
      res.json({'status': true, 'employees': employees})
    })

}

function processShifts(err, tmp_shifts, callback) {
  if (!Array.isArray(tmp_shifts)) {
    tmp_shifts = [tmp_shifts]
  }
  let contact, shifts
  shifts = []
  let downloadedShifts = 0;
  tmp_shifts.forEach((tmp_shift) => {
    if (err) {
      //handle errors
    }
    let skills = [];
    global.datastore.get(tmp_shift.contactId, (err, tmp_contact) => {
      if (tmp_contact !== undefined) {
        contact = helpers.contactSerializer(tmp_contact)
      }
      helpers.findInRelationalEntity(
        tmp_shift[global.datastore.KEY],
        '_ShiftSkill',
        (tmp_skills) => {
          tmp_skills.forEach((tmp_skill) => {
            skills.push(helpers.skillSerializer(tmp_skill))
          })
          helpers.sortByDay(shifts, helpers.shiftSerializer(tmp_shift, helpers.sortByKey(skills, 'name'), contact), 'shifts')
          downloadedShifts++
          if (downloadedShifts === tmp_shifts.length) {
            shifts.forEach(function (day) {
              helpers.sortByKey(day.shifts, 'startingDate');
            })
            helpers.sortByKey(shifts, 'date');
            callback(shifts)
          }
        })
    })
  })
}

module.exports = {
  index: index,
  show: show,
  create: create,
  update: update,
  remove: remove,
  addSkill: addSkill,
  removeSkill: removeSkill,
  addEmployee: addEmployee,
  removeEmployee: removeEmployee,
  getEmployees: getEmployees
}
