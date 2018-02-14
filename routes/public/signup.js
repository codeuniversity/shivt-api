'use strict'

const express = require('express')
const validate = require('express-validation')

const signupController = require('../../controllers/signup')
const signup = require('../../validation/signup')

let router = express.Router()

router.post('/', validate(signup), signupController.signup)
router.get('/activate/:hash', signupController.activate)

module.exports = router
