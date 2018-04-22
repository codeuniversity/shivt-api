'use strict'

const helpers = require("../util/helpers")
const errors = require('../util/error_handling');
const randomstring = require("randomstring")
const interchangeable_routes = require("../util/interchangeable_routes")
const fs = require('fs')
const config = require('config')
const jwt = require('jsonwebtoken')

function index(req, res) {

  global.datastore.runQuery(global.datastore.createQuery('Employee'), (err, tmp_employees) => {
    processEmployees(err, tmp_employees, (employees) => {
      res.json({'status': true, 'employees': employees})
    })
  })

}

function show(req, res) {

  if(req.decoded.data === req.params.employeeId || (typeof req.decoded.data) !== 'string') {

    global.datastore.get(global.datastore.key(['Employee', parseInt(req.params.employeeId)]), (err, tmp_employee) => {
      if (tmp_employee === undefined) {
        errors.output('employee_not_exist', 'employee does not exist', res)
      } else {
        processEmployees(err, tmp_employee, (employee) => {
          res.json({'status': true, 'employee': employee[0]})
        })
      }
    })

  } else {

    errors.output('not_permitted', 'You are not permitted to perform this action', res);

  }

}

function create(req, res) {
  const inviteCode = randomstring.generate({
    length: 6,
    charset: 'alphanumeric'
  })
  const entity = {
    key: global.datastore.key('Employee'),
    data: {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      gender: req.body.gender,
      email: req.body.email,
      phone: req.body.phone,
      inviteCode: inviteCode,
    }
  }
  global.datastore.insert(entity).then((results) => {
    res.json({'status': true, 'id': results[0].mutationResults[0].key.path[1].id})
  })
}

function update(req, res) {
  global.datastore.get(global.datastore.key(['Employee', parseInt(req.params.employeeId)]), (err, employee) => {
    if (employee === undefined) {
      errors.output('employee_not_exist', 'employee does not exist', res)
    } else {
      const entity = {
        key: global.datastore.key(['Employee', parseInt(req.params.employeeId)]),
        data: {
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          gender: req.body.gender,
          email: req.body.email,
          phone: req.body.phone,
          inviteCode: employee.inviteCode
        }
      }
      global.datastore.update(entity, (err) => {
        if (err) {
          if (err.code === 5) {
            errors.output('employee_not_exist', 'employee does not exist', res)
          }
        }
        res.json({'status': true})
      })
    }
  })
}

function remove(req, res) {
  global.datastore.delete(global.datastore.key(['Employee', parseInt(req.params.employeeId)]), () => {
    res.json({'status': true})
  });
}

function addSkill(req, res) {
  helpers.insertRelation(
    false,
    '_EmployeeSkill',
    global.datastore.key(['Employee', parseInt(req.params.employeeId)]),
    global.datastore.key(['Skill', parseInt(req.params.skillId)]),
    res,
    (result) => {
      if(result === true) {
        res.json({'status': true})
      }
    }
    )
}

function removeSkill(req, res) {
  global.datastore.runQuery(global.datastore.createQuery('_EmployeeSkill')
      .filter('employee', global.datastore.key(['Employee', parseInt(req.params.employeeId)]))
      .filter('skill', global.datastore.key(['Skill', parseInt(req.params.skillId)])),
    (err, exists) => {
      if (exists.length === 0) {
        errors.output('relation_not_exist', 'relation does not exist', res)
      } else {
        global.datastore.delete(global.datastore.key(['_EmployeeSkill', parseInt(exists[0][global.datastore.KEY].id)]), () => {
          res.json({'status': true})
        })
      }
    })
}

function addShift(req, res) {

  interchangeable_routes.addShiftEmployee(req, res)

}

function removeShift(req, res) {

  interchangeable_routes.removeShiftEmployee(req, res)

}

function getShifts(req, res) {

  let shifts = []

  helpers.findInRelationalEntity(
    global.datastore.key(['Employee', parseInt(req.params.employeeId)]),
    '_ShiftEmployee',
    (tmp_shifts) => {
      tmp_shifts.forEach((tmp_shift) => {
        shifts.push({
          'id': tmp_shift[global.datastore.KEY].id,
          'name': tmp_shift.name,
          'meetingPoint': tmp_shift.meetingPoint,
          'startingDate': tmp_shift.startingDate,
          'endingDate': tmp_shift.endingDate,
        })
      })
      helpers.sortByKey(shifts, 'startingDate');
      res.json({'status': true, 'shifts': shifts})
    })

}

function login(req, res) {

  global.datastore.runQuery(global.datastore.createQuery('Employee').filter('inviteCode', '=', req.body.inviteCode).limit(1), (err, employee) => {
    errors.handle(err, res)
    if (employee.length > 0) {
      console.log('found')
            let cert = fs.readFileSync(config.get('token.privat'))
            let token = jwt.sign({
              data: employee[0][global.datastore.KEY].id
            }, cert, {algorithm: config.get('token.algorithm'), expiresIn: config.get('token.expires')})
            res.json({'status': true, 'id': employee[0][global.datastore.KEY].id, 'token': token})
    } else {
      errors.output('employee_not_found', 'employee not found', res)
    }

  })

}

function getBlockedTimes(req, res) {

  let blockedTimes = []

  helpers.findInRelationalEntity(
    global.datastore.key(['Employee', parseInt(req.params.employeeId)]),
    '_BlockedTimeEmployee',
    (tmp_blockedtimes) => {
      console.log(tmp_blockedtimes)
      tmp_blockedtimes.forEach((tmp_blockedtime) => {
        if(tmp_blockedtime[global.datastore.KEY].parent.id === req.params.eventId)
        blockedTimes.push({
          'id': tmp_blockedtime[global.datastore.KEY].id,
          'startingDate': tmp_blockedtime.startingDate,
          'endingDate': tmp_blockedtime.endingDate,
        })
      })
      res.json({'status': true, 'blockedTimes': blockedTimes})
    })

}

function addBlockedTime(req, res) {

  console.log(req.decoded);

  if(req.decoded.data === req.params.employeeId) {

    const entity = {
      key: global.datastore.key(['Event', parseInt(req.params.eventId), 'BlockedTime']),
      data: {
        startingDate: new Date(req.body.startingDate),
        endingDate: new Date(req.body.endingDate),
      }
    }
    global.datastore.insert(entity).then((results) => {
      interchangeable_routes.addBlockedTimeEmployee(results[0].mutationResults[0].key.path[1].id, req, res)
      res.json({'status': true, 'id': results[0].mutationResults[0].key.path[1].id})
    })

  } else {

    errors.output('not_permitted', 'You are not permitted to perform this action', res);

  }

}

function removeBlockedTime(req, res) {

  global.datastore.delete(global.datastore.key(['Event', parseInt(req.params.eventId), 'BlockedTime', parseInt(req.params.blockedTimeId)]), () => {
    interchangeable_routes.removeBlockedTimeEmployee(req, res)
    res.json({'status': true})
  });

}

function updateBlockedTime(req, res) {

global.datastore.get(global.datastore.key(['Event', parseInt(req.params.eventId), 'BlockedTime', parseInt(req.params.blockedTimeId)]), (err, blockedTime) => {
  if (blockedTime === undefined) {
    errors.output('blocked_time_not_exist', 'blocked time does not exist', res)
  } else {
    const entity = {
      key: global.datastore.key(['Event', parseInt(req.params.eventId), 'BlockedTime', parseInt(req.params.blockedTimeId)]),
      data: {
        startingDate: req.body.startingDate,
        endingDate: req.body.endingDate
      }
    }
    global.datastore.update(entity, (err) => {
      if (err) {
        if (err.code === 5) {
          errors.output('blocked_time_not_exist', 'blocked time does not exist', res)
        }
      }
      res.json({'status': true})
    })
  }
})
}


function processEmployees(err, tmp_employees, callback) {
  if (!Array.isArray(tmp_employees)) {
    tmp_employees = [tmp_employees]
  }
  let employees
  employees = []
  tmp_employees.forEach((tmp_employee) => {
    if (err) {
      //handle errors
    }
    let skills = [];
    let events = [];
    helpers.findInRelationalEntity(
      tmp_employee[global.datastore.KEY],
      '_EmployeeSkill',
      (tmp_skills) => {
        tmp_skills.forEach((tmp_skill) => {
          skills.push(helpers.skillSerializer(tmp_skill))
        })
        employees.push(helpers.employeeSerializer(tmp_employee, helpers.sortByKey(skills, 'name')))
        helpers.findInRelationalEntity(

          global.datastore.key(['Employee', parseInt(employees[employees.length-1].id)]),
          '_EmployeeEvent',
          (tmp_events) => {
            tmp_events.forEach((tmp_event) => {
              events.push({
                'id': tmp_event[global.datastore.KEY].id,
                'name': tmp_event.name,
                'startingDate': tmp_event.startingDate,
                'endingDate': tmp_event.endingDate,
                'location': tmp_event.location
              })
              console.log(events)
            })
            employees[employees.length-1]['events'] = events;
            if (employees.length === tmp_employees.length) {
              helpers.sortByKey(employees, 'lastname');
              callback(employees)
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
  addShift: addShift,
  removeShift: removeShift,
  getShifts: getShifts,
  getBlockedTimes: getBlockedTimes,
  addBlockedTime: addBlockedTime,
  updateBlockedTime: updateBlockedTime,
  removeBlockedTime: removeBlockedTime,
  login: login
}
