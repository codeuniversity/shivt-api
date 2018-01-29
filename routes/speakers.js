'use strict';

const express = require('express')
const speakersController = require('../controllers/speakers');

let router = express.Router({mergeParams: true});

router.get('/', speakersController.getSpeakers);
router.get('/:speakerId', speakersController.show);

module.exports = router;