'use strict'

const express = require('express')
const sponsorsController = require('../../controllers/sponsors')

let router = express.Router({mergeParams: true})

router.get('/', sponsorsController.getSponsors)
router.get('/:sponsorId', sponsorsController.show)

module.exports = router