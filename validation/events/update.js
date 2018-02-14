const Joi = require('joi')

module.exports = {
  body: {
    id: Joi.number().max(9999999999999999).required(),
    name: Joi.string().required(),
    description: Joi.string().max(250),
    location: Joi.string().max(100),
    startingDate: Joi.date().required(),
    endingDate: Joi.date().required()
  }
};
