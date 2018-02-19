const Joi = require('joi')

module.exports = {
  body: {
    name: Joi.string().max(50).required(),
    description: Joi.string().max(2000).required(),
    startingDate: Joi.string().isoDate().required(),
    endingDate: Joi.string().isoDate().required(),
    preferredGender: Joi.string().valid(['MALE', 'FEMALE']),
    meetingPoint: Joi.string().max(50).required(),
    contactId: Joi.number().min(1000000000000000).max(9999999999999999).required()
  }
}
