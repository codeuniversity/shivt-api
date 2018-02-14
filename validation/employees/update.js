const Joi = require('joi')

module.exports = {
  body: {
    id: Joi.number().max(9999999999999999).required(),
    name: Joi.string().max(50).required(),
    gender: Joi.number().integer().max(3),
    mail: Joi.string().email(),
    phone: Joi.string().max(30),
  }
}
