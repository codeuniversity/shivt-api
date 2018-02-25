const Joi = require('joi')

module.exports = {
  body: {
    name: Joi.string().max(50).required(),
  }
}
