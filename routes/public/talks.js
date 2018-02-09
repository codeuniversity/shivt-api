'use strict'

const express = require('express')
const talksController = require('../../controllers/talks')

let router = express.Router({mergeParams: true})

router.get('/', talksController.getTalks)
router.get('/:talkId', talksController.show)

module.exports = router