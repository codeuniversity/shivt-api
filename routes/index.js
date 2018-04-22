'use strict'
const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const fs = require('fs')
const config = require('config')

const errors = require('../util/error_handling')
const publicRoutes = require('./public_routes')
const privatRoutes = require('./private_routes')

router.use('/api/v1', publicRoutes)
router.use((req, res, next) => {
  var token = req.headers['x-access-token']
  if (token) {
    let cert = fs.readFileSync(config.get('token.public'))
    jwt.verify(token, cert, {algorithm: ['RS256']}, (err, decod) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          errors.output('token_expired', 'token expired', res)
        }
        else {
          errors.output('wrong_token', 'wrong token', res)
        }
      }
      else {

        // Permission management for employees

        if(!isNaN(decod)) {
          if(
            ((RegExp('/api/v1/employees/(.*)/shifts').test(req.url))
            && req.method === 'GET') || ((RegExp('/api/v1/employees/(.*)').test(req.url))
            && req.method === 'GET') || ((RegExp('/api/v1/events/(.*)/shifts/(.*)').test(req.url))
              && req.method === 'GET') ||
              RegExp('/api/v1/employees/(.*)/blocked').test(req.url) ||
              RegExp('/api/v1/employees/(.*)/blocked/(.*)').test(req.url)
              ){
                console.log('pass')
                req.decoded = decod
                next()
          } else {
            errors.output('not_permitted', 'this user is not permitted to access the requested function', res)
          }
        } else {
          req.decoded = decod
          next()
      }
      }
    })
  }
  else {

    // We want to enable employees to login without a token

    if(!RegExp('/api/v1/employees/login').test(req.url)) {
      errors.output('no_token', 'no token provided', res)
    } else {
      next()
    }
  }
})
router.use('/api/v1', privatRoutes)
module.exports = router
