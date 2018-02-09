'use strict'

const express = require('express')
const validate = require('express-validation')

const loginController = require('../../controllers/login')
const login = require('../../validation/login')

let router = express.Router()

router.post('/', validate(login), loginController.login)

module.exports = router
