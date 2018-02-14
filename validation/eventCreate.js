const Joi = require('joi')

module.exports = {
  body: {
    name: Joi.string().required(),
    description: Joi.string().max(250),
    location: Joi.string().max(100),
    startingDate: Joi.date().required(),
    endingDate: Joi.date().required()
  }
};
