'use strict'

const express = require('express')
const validate = require('express-validation')

const shiftController = require('../../controllers/shifts')
const shiftCreateValidate = require('../../validation/shifts/create')

let router = express.Router({mergeParams: true})

router.get('/', shiftController.index)
router.get('/:shiftId', shiftController.show)
router.post('/create', validate(shiftCreateValidate), shiftController.create)

module.exports = router
