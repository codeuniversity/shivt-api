'use strict'

const express = require('express')
const validate = require('express-validation')

const eventController = require('../../controllers/events')
const eventCreateValidate = require('../../validation/events/create')
const eventUpdateValidate = require('../../validation/events/update')

let router = express.Router({mergeParams: true})

router.post('/create', validate(eventCreateValidate), eventController.create)
router.post('/update', validate(eventUpdateValidate), eventController.update)

module.exports = router
