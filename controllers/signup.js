'use strict'

const config = require('config')
const bcrypt = require('bcrypt')
const fs = require('fs')
const mailgun = require('mailgun-js')({apiKey: config.get('mailgun.key'), domain: config.get('mailgun.domain')})


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
              active: 0,
              name: req.body.name,
              mail: req.body.mail,
              password: passwordHash,
              type: 0,
              hash: Buffer.from(hash).toString('base64')
            }
          }
          global.datastore.insert(entity).then(() => {
            let html = fs.readFileSync('mail/signup.html', 'utf8')
              .replace('{name}', req.body.name)
              .replace('{link}', 'https://api.shivt.io/v1/signup/activate/'+Buffer.from(hash).toString('base64'))
            let data = {
              from: 'Shivt Team <no-reply@unicode.berlin>',
              to: req.body.mail,
              subject: 'Shivt: Activate your account',
              html: html
            }
            mailgun.messages().send(data, function (error, body) {
              res.json({'status': true})
            })
          })
        })
      })
    }
  })
}

function activate (req, res) {
  const query = global.datastore.createQuery('User').filter('hash', '=', req.params.hash)
  global.datastore.runQuery(query, (err, user) => {
    if(user[0]){
      if(user[0].active!=1){
        user[0].active = 1
        user[0].hash = ''
        const entity = {
          key: user[0][global.datastore.KEY],
          data: user[0]
        }
        global.datastore.save(entity).then(() => {
          res.json({'status': true})
        })
      }else{
        errors.output('user_already_activated', 'user already activated', res)
      }
    }else{
      errors.output('user_not_exist', 'user does not exist', res)
    }
  })
}


module.exports = {
  'signup': signup,
  'activate': activate
}
