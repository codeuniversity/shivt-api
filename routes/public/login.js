'use strict'

const express = require('express')
const validate = require('express-validation')

const loginController = require('../../controllers/login')
const validation = require('../../validation/login')

let router = express.Router()

router.post('/', validate(validation), loginController.login)

module.exports = router
