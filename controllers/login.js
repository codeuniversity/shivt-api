'use strict'

const jwt = require('jsonwebtoken')
const fs = require('fs')
const bcrypt = require('bcrypt')
const config = require('config')

const errors = require('../util/error_handling')
const helpers = require('../util/helpers')

function login (req, res) {
  global.datastore.runQuery(global.datastore.createQuery('User').filter('mail', '=', req.body.mail).limit(1), (err, user) => {
    errors.handle(err, res)
    if (user.length > 0) {
      bcrypt.compare(req.body.password, user[0].password, (err, pwCheck) => {
        if (pwCheck) {
          let cert = fs.readFileSync(config.get('token.privat'))
          let token = jwt.sign({
            data: helpers.userSerializer(user),
          }, cert, {algorithm: config.get('token.algorithm'), expiresIn: config.get('token.expires')})
          res.json({'status': true, 'token': token})
        } else {
          errors.output('wrong_password', 'wrong password provided')
        }
      })
    } else {
      errors.output('user_not_found', 'user not found')
    }
  })
}

module.exports = {
  'login': login
}