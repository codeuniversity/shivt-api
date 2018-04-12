'use strict'

const express = require('express')
const validate = require('express-validation')

const shiftController = require('../../controllers/shifts')
const shiftCreateValidate = require('../../validation/shifts/create')

let router = express.Router({mergeParams: true})

router.get('/', shiftController.index)
router.get('/:shiftId', shiftController.show)
router.post('/', validate(shiftCreateValidate), shiftController.create)
router.put('/:shiftId', validate(shiftCreateValidate), shiftController.update)
router.delete('/:shiftId', shiftController.remove)
router.post('/:shiftId/skills/:skillId', shiftController.addSkill)
router.delete('/:shiftId/skills/:skillId', shiftController.removeSkill)
router.post('/:shiftId/employees/:employeeId', shiftController.addEmployee)
router.delete('/:shiftId/employees/:employeeId', shiftController.removeEmployee)
router.get('/:shiftId/employees/', shiftController.getEmployees)
//router.put('/:shiftId/employees/:employeeId', shiftController.updateAttendance)


module.exports = router
