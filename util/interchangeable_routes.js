'use strict'

const helpers = require("../util/helpers")
const errors = require("../util/error_handling")


function addShiftEmployee(req, res) {

  helpers.insertRelation(
    false,
    '_ShiftEmployee',
    global.datastore.key(['Shift', parseInt(req.params.shiftId)]),
    global.datastore.key(['Employee', parseInt(req.params.employeeId)]),
    res,
    (result) => {
      if (result) {
        res.json({'status': true})
      }
    }
  )

}

function removeShiftEmployee(req, res) {

  global.datastore.runQuery(global.datastore.createQuery('_ShiftEmployee')
      .filter('shift', global.datastore.key(['Event', parseInt(req.params.eventId), 'Shift', parseInt(req.params.shiftId)]))
      .filter('employee', global.datastore.key(['Employee', parseInt(req.params.employeeId)])),
    (err, exists) => {
      if (exists.length === 0) {
        errors.output('relation_not_exist', 'relation does not exist', res)
      } else {
        global.datastore.delete(global.datastore.key(['_ShiftEmployee', parseInt(exists[0][global.datastore.KEY].id)]), () => {
          res.json({'status': true})
        })
      }
    })

}

function addBlockedTimeEmployee(blockedTimeId, req, res) {

  helpers.insertRelation(
    false,
    '_BlockedTimeEmployee',
    global.datastore.key(['Event', parseInt(req.params.eventId), 'BlockedTime', parseInt(blockedTimeId)]),
    global.datastore.key(['Employee', parseInt(req.params.employeeId)]),
    res,
    (result) => {
      if (result === true) {
        return true;
      } else {
        return false;
      }
    }
  )

}

function removeBlockedTimeEmployee(req, res) {

  global.datastore.runQuery(global.datastore.createQuery('_BlockedTimeEmployee')
      .filter('blockedtime', global.datastore.key(['Event', parseInt(req.params.eventId), 'BlockedTime', parseInt(req.params.blockedTimeId)]))
      .filter('employee', global.datastore.key(['Employee', parseInt(req.params.employeeId)])),
    (err, exists) => {
      if (exists.length === 0) {
        errors.output('relation_not_exist', 'relation does not exist', res)
      } else {
        global.datastore.delete(global.datastore.key(['_BlockedTimeEmployee', parseInt(exists[0][global.datastore.KEY].id)]), () => {
          return true;
        })
      }
    })

}

function addEmployeeEvent(req, res) {
  helpers.insertRelation(
    false,
    '_EmployeeEvent',
    global.datastore.key(['Event', parseInt(req.params.eventId)]),
    global.datastore.key(['Employee', parseInt(req.params.employeeId)]),
    res,
    (result) => {
      if(result) {
        res.json({'status': true})
      }
    }
  )
}

function removeEmployeeEvent(req, res) {
  global.datastore.runQuery(global.datastore.createQuery('_EmployeeEvent')
      .filter('employee', global.datastore.key(['Event', parseInt(req.params.eventId)]))
      .filter('event', global.datastore.key(['Employee', parseInt(req.params.employeeId)])),
    (err, exists) => {
      if (exists.length === 0) {
        errors.output('relation_not_exist', 'relation does not exist', res)
      } else {
        global.datastore.delete(global.datastore.key(['_EmployeeEvent', parseInt(exists[0][global.datastore.KEY].id)]), () => {
          res.json({'status': true})
        })
      }
    })
}

module.exports = {
  addShiftEmployee: addShiftEmployee,
  removeShiftEmployee: removeShiftEmployee,
  addBlockedTimeEmployee: addBlockedTimeEmployee,
  removeBlockedTimeEmployee: removeBlockedTimeEmployee,
  addEmployeeEvent: addEmployeeEvent,
  removeEmployeeEvent: removeEmployeeEvent
}
