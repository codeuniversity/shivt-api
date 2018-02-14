'use strict'

const express = require('express')
const validate = require('express-validation')

const employeeController = require('../../controllers/employees')
const employeeCreateValidate = require('../../validation/employees/create')
const employeeUpdateValidate = require('../../validation/employees/update')

let router = express.Router({mergeParams: true})

router.post('/create', validate(employeeCreateValidate), employeeController.create)
router.post('/update', validate(employeeUpdateValidate), employeeController.update)

module.exports = router
