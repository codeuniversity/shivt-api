'use strict'

const express = require('express')
const validate = require('express-validation')

const skillController = require('../../controllers/skills')
const skillCreateValidate = require('../../validation/skills/create')

let router = express.Router({mergeParams: true})

router.get('/', skillController.index)
router.get('/:skillId', skillController.show)
router.post('/create', validate(skillCreateValidate), skillController.create)
router.post('/:skillId/update', validate(skillCreateValidate), skillController.update)
router.post('/:skillId/delete', skillController.remove)

module.exports = router
