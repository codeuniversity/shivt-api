const log = require('../util/log')

function output(code, message, res){
  res.json(getErrorJSON(code, message))
}

function handle (err, res) {
  if (err) {
    res.status(500)
    if (err.name === 'TypeError' && err.message.indexOf('Cannot read property') !== -1 && err.message.indexOf('of undefined') !== -1) {
      res.json(getErrorJSON('object_not_exist', 'The requested object does not exist in the database.'))
    }
    else {
      res.json(getErrorJSON('unkown_error', err))
    }
    log.error(err)
  }
}

function getErrorJSON (code, message) {
  log.error(message)
  return {'status': 'error', 'code': code, 'message': message}
}

module.exports = {
  handle: handle,
  output: output,
  getErrorJSON: getErrorJSON
}
