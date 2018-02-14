const Joi = require('joi')

module.exports = {
  body: {
    name: Joi.string().max(50).required(),
    mail: Joi.string().email().required(),
    password: Joi.string().regex(/[a-zA-Z0-9]{8,30}/).required()
  }
};
