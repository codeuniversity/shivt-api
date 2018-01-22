'use strict';

const express = require('express')
const mockController = require('../controllers/mock');

let router = express.Router({mergeParams: true});

router.get('/', mockController.show);

module.exports = router;