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
      if (user[0].active == 1) {
        bcrypt.compare(req.body.password, user[0].password, (err, pwCheck) => {
          if (pwCheck) {
            let cert = fs.readFileSync(config.get('token.privat'))
            let token = jwt.sign({
              data: helpers.userSerializer(user),
            }, cert, {algorithm: config.get('token.algorithm'), expiresIn: config.get('token.expires')})
            res.json({'status': true, 'id': user[0][global.datastore.KEY].id, 'token': token})
          } else {
            errors.output('wrong_password', 'wrong password provided', res)
          }
        })
      } else {
        errors.output('account_not_activated', 'activate your account', res)
      }
    } else {
      errors.output('user_not_found', 'user not found', res)
    }

  })
}

module.exports = {
  'login': login
}
