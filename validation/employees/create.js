const Joi = require('joi')

module.exports = {
  body: {
    firstname: Joi.string().max(50).required(),
    lastname: Joi.string().max(50).required(),
    gender: Joi.string().valid(['MALE', 'FEMALE']),
    email: Joi.string().email(),
    phone: Joi.string().max(30),
  }
}
