'use strict'
module.exports = function (app) {

    const eventRoutes = require('./event');

    app.get('/', function (req, res) {
        res.send('Welcome to this awesome API!');
    })

    app.use("/event", eventRoutes);
};