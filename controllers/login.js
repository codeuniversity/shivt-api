"use strict"

const errors = require( '../util/error_handling' )
const helpers = require('../util/helpers')
const jwt = require('jsonwebtoken')
const fs = require('fs')
const bcrypt = require('bcrypt')

function login(req, res) {
  global.datastore.runQuery(global.datastore.createQuery('User').filter('mail', '=', req.body.mail).limit(1), (err, user) => {
    if(user.length>0){
      bcrypt.compare(req.body.password, user[0].password, (err, pwCheck) => {
        if(pwCheck){
          let cert = fs.readFileSync('token_privat.key')
          let token = jwt.sign({
            data: helpers.userSerializer(user),
          }, cert, { algorithm: 'RS256', expiresIn: '1h' })
          res.json({'status': true, 'token': token})
        }else{
          res.status(403).json({'status': false, 'code': 'wrong_password', 'message': 'wrong password'})
        }
      })
    }else{
      res.status(403).json({'status': false, 'code': 'user_not_found', 'message': 'user not found'})
    }
  })
}

module.exports = {
    'login': login
};
