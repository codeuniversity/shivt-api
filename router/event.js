'use strict';

const express = require('express')
const eventController = require('../controllers/event');

let router = express.Router();

router.get('/:eventId', eventController.show);

module.exports = router;