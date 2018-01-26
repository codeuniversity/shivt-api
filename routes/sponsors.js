'use strict';

const express = require('express')
const sponsorsController = require('../controllers/sponsors');

let router = express.Router({mergeParams: true});

router.get('/', sponsorsController.index);
router.get('/:sponsorId', sponsorsController.show);

module.exports = router;