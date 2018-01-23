'use strict';

const express = require('express')
const speakersController = require('../controllers/speakers');

let router = express.Router({mergeParams: true});

router.get('/', speakersController.index);
router.get('/:speakerId', speakersController.show);

module.exports = router;