'use strict';

const express = require('express')
const talksController = require('../controllers/talks');

let router = express.Router({mergeParams: true});

router.get('/', talksController.index);

module.exports = router;