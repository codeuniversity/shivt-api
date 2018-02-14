const Joi = require('joi')

module.exports = {
  body: {
    name: Joi.string().max(50).required(),
    gender: Joi.number().integer().max(3),
    mail: Joi.string().email(),
    phone: Joi.string().max(30),
  }
}
