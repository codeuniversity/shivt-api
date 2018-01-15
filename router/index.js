'use strict'
module.exports = function (app) {
  var test = require('../controllers/Test')
  app.route('/test')
    .get(test.thisIsATestFunction)
}