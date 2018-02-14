'use strict'

const express = require('express')
const validate = require('express-validation')

const eventController = require('../../controllers/events')
const eventCreateValidate = require('../../validation/eventCreate')

let router = express.Router({mergeParams: true})

router.post('/create', validate(eventCreateValidate), eventController.create)

module.exports = router
