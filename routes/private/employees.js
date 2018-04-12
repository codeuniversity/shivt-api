'use strict'

const express = require('express')
const validate = require('express-validation')

const employeeController = require('../../controllers/employees')
const employeeCreateValidate = require('../../validation/employees/create')

let router = express.Router({mergeParams: true})

router.get('/', employeeController.index)
router.get('/:employeeId', employeeController.show)
router.post('/', validate(employeeCreateValidate), employeeController.create)
router.put('/:employeeId', validate(employeeCreateValidate), employeeController.update)
router.delete('/:employeeId', employeeController.remove)
router.post('/:employeeId/skills/:skillId', employeeController.addSkill)
router.delete('/:employeeId/skills/:skillId', employeeController.removeSkill)
router.post('/:employeeId/shifts/:shiftId', employeeController.addShift)
router.delete('/:employeeId/shifts/:shiftId', employeeController.removeShift)
router.get('/:employeeId/shifts/', employeeController.getShifts)
router.get('/:employeeId/blocked', employeeController.getBlockedTimes)
router.post('/:employeeId/blocked', employeeController.addBlockedTime)
router.delete('/:employeeId/blocked/:blockedTimeId', employeeController.removeBlockedTime)
router.post('/login/', employeeController.login)

module.exports = router
