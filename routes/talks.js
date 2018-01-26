'use strict';

const express = require('express')
const talksController = require('../controllers/talks');

let router = express.Router({mergeParams: true});

router.get('/', talksController.index);
router.get('/:talkId', talksController.show);

module.exports = router;