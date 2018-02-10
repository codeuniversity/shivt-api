'use strict'

const config = require('config')
const bcrypt = require('bcrypt')

const errors = require('../util/error_handling')
const helpers = require('../util/helpers')

function signup (req, res) {
  global.datastore.runQuery(global.datastore.createQuery('User').filter('mail', '=', req.body.mail).limit(1), (err, user) => {
    errors.handle(err, res)
    if (user.length > 0) {
      errors.output('user_already_exist', 'user already exist', res)
    } else {
      bcrypt.hash(req.body.password, config.get('bcrypt.saltRounds'), (err, passwordHash) => {
        bcrypt.hash('SHIVT' + Math.floor(Math.random() * Math.floor(9999)) + Date.now(), config.get('bcrypt.saltRounds'), (err, hash) => {
          const entity = {
            key: global.datastore.key('User'),
            data: {
              mail: req.body.mail,
              password: passwordHash,
              type: 0,
              hash: Buffer.from(hash).toString('base64')
            }
          }
          global.datastore.insert(entity).then(() => {
            res.json({'status': true})
          })
        })
      })
    }
  })

}

module.exports = {
  'signup': signup
}
