'use strict'

const helpers = require("../util/helpers")
const errors = require('../util/error_handling');
const randomstring = require("randomstring")
const interchangeable_routes = require("../util/interchangeable_routes")

function index(req, res) {

  global.datastore.runQuery(global.datastore.createQuery('Employee').hasAncestor(datastore.key(['Event', parseInt(req.params.eventId)])), (err, tmp_employees) => {
    processEmployees(err, tmp_employees, (employees) => {
      res.json({'status': true, 'employees': employees})
    })
  })

}

function show(req, res) {

  global.datastore.get(global.datastore.key(['Event', parseInt(req.params.eventId), 'Employee', parseInt(req.params.employeeId)]), (err, tmp_employee) => {
    if (tmp_employee === undefined) {
      errors.output('employee_not_exist', 'employee does not exist', res)
    } else {
      processEmployees(err, tmp_employee, (employee) => {
        res.json({'status': true, 'shift': employee[0]})
      })
    }
  })

}

function create(req, res) {
  const inviteCode = randomstring.generate({
    length: 6,
    charset: 'alphanumeric'
  })
  const entity = {
    key: global.datastore.key(['Event', parseInt(req.params.eventId), 'Employee']),
    data: {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      gender: req.body.gender,
      email: req.body.email,
      phone: req.body.phone,
      inviteCode: inviteCode
    }
  }
  global.datastore.insert(entity).then((results) => {
    res.json({'status': true, 'id': results[0].mutationResults[0].key.path[1].id})
  })
}

function update(req, res) {
  global.datastore.get(global.datastore.key(['Event', parseInt(req.params.eventId), 'Employee', parseInt(req.params.employeeId)]), (err, employee) => {
    if (employee === undefined) {
      errors.output('employee_not_exist', 'employee does not exist', res)
    } else {
      const entity = {
        key: global.datastore.key(['Event', parseInt(req.params.eventId), 'Employee', parseInt(req.params.employeeId)]),
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
  global.datastore.delete(global.datastore.key(['Event', parseInt(req.params.eventId), 'Employee', parseInt(req.params.employeeId)]), () => {
    res.json({'status': true})
  });
}

function addSkill(req, res) {
  helpers.insertRelation(
    '_EmployeeSkill',
    global.datastore.key(['Event', parseInt(req.params.eventId), 'Employee', parseInt(req.params.employeeId)]),
    global.datastore.key(['Event', parseInt(req.params.eventId), 'Skill', parseInt(req.params.skillId)]),
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
      .filter('employee', global.datastore.key(['Event', parseInt(req.params.eventId), 'Employee', parseInt(req.params.employeeId)]))
      .filter('skill', global.datastore.key(['Event', parseInt(req.params.eventId), 'Skill', parseInt(req.params.skillId)])),
    (err, exists) => {
      if (exists.length === 0) {
        errors.output('relation_not_exist', 'relation does not exist', res)
      } else {
        global.datastore.delete(global.datastore.key(['Event', parseInt(req.params.eventId), '_EmployeeSkill', parseInt(exists[0][global.datastore.KEY].id)]), () => {
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
    global.datastore.key(['Event', parseInt(req.params.eventId), 'Employee', parseInt(req.params.employeeId)]),
    '_ShiftEmployee',
    (tmp_shifts) => {
      tmp_shifts.forEach((tmp_shift) => {
        shifts.push({
          'id': tmp_shift[global.datastore.KEY].id,
          'name': tmp_shift.name,
          'description': tmp_shift.description,
          'startingDate': tmp_shift.startingDate,
          'endingDate': tmp_shift.endingDate,
        })
      })
      res.json({'status': true, 'shifts': shifts})
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
    helpers.findInRelationalEntity(
      tmp_employee[global.datastore.KEY],
      '_EmployeeSkill',
      (tmp_skills) => {
        tmp_skills.forEach((tmp_skill) => {
          skills.push(helpers.skillSerializer(tmp_skill))
        })
        employees.push(helpers.employeeSerializer(tmp_employee, helpers.sortByKey(skills, 'name')))
        if (employees.length === tmp_employees.length) {
          helpers.sortByKey(employees, 'lastname');
          callback(employees)
        }
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
  getShifts: getShifts
}
