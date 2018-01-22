'use strict'

const express = require('express');
const router = express.Router();

    const eventRoutes = require('./event');
    const talksRoutes = require('./talks');
    const mockRoutes = require('./mock');

router.get('/', function (req, res) {
        res.send('Welcome to this awesome API!');
    })

    router.use("/event", eventRoutes);
    router.use("/event/:eventId/talks", talksRoutes);
    router.use("/event/:eventId/mock", mockRoutes);


module.exports = router;