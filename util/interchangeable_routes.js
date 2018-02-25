'use strict'

const helpers = require("../util/helpers")

function addShiftEmployee(req, res) {

  helpers.insertRelation(
    '_ShiftEmployee',
    global.datastore.key(['Event', parseInt(req.params.eventId), 'Shift', parseInt(req.params.shiftId)]),
    global.datastore.key(['Event', parseInt(req.params.eventId), 'Employee', parseInt(req.params.employeeId)]),
    res,
    (result) => {
      if (result === true) {
        res.json({'status': true})
      }
    }
  )

}

function removeShiftEmployee(req, res) {

  global.datastore.runQuery(global.datastore.createQuery('_ShiftEmployee')
      .filter('shift', global.datastore.key(['Event', parseInt(req.params.eventId), 'Shift', parseInt(req.params.shiftId)]))
      .filter('employee', global.datastore.key(['Event', parseInt(req.params.eventId), 'Employee', parseInt(req.params.employeeId)])),
    (err, exists) => {
      if (exists.length === 0) {
        errors.output('relation_not_exist', 'relation does not exist', res)
      } else {
        global.datastore.delete(global.datastore.key(['Event', parseInt(req.params.eventId), '_ShiftEmployee', parseInt(exists[0][global.datastore.KEY].id)]), () => {
          res.json({'status': true})
        })
      }
    })

}

module.exports = {
  addShiftEmployee: addShiftEmployee,
  removeShiftEmployee: removeShiftEmployee
}
