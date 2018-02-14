'use strict'
const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const fs = require('fs')
const config = require('config')

const errors = require('../util/error_handling')
const publicRoutes = require('./publicRoutes')
const privatRoutes = require('./privatRoutes')

router.use('/api/v1', publicRoutes)
router.use((req, res, next) => {
  var token = req.headers['x-access-token']
  if (token) {
    let cert = fs.readFileSync(config.get('token.public'))
    jwt.verify(token, cert, {algorithm: ['RS256']}, (err, decod) => {
      if (err) {
        if (err.name == 'TokenExpiredError') {
          errors.output('token_expired', 'token expired', res)
        }
        else {
          errors.output('wrong_token', 'wrong token', res)
        }
      }
      else {
        req.decoded = decod
        next()
      }
    })
  }
  else {
    errors.output('no_token', 'no token provided', res)
  }
})
router.use('/api/v1', privatRoutes)
module.exports = router
