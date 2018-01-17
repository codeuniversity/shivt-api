'use strict'

const express = require('express');
const router = express.Router();

    const eventRoutes = require('./event');
    const talksRoutes = require('./talks');

router.get('/', function (req, res) {
        res.send('Welcome to this awesome API!');
    })

    router.use("/event", eventRoutes);
    router.use("/event/:eventId/talks", talksRoutes);


module.exports = router;