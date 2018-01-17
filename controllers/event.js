'use strict';

const errors = require('../util/error_handling');

function show (req, res) {
    GLOBAL.datastore.get(GLOBAL.datastore.key(['event', parseInt(req.params.eventId)]))
        .then((results) => {
            res.json({"status": "OK", "event":
                    {
                        "name": results[0].name,
                        "description": results[0].description,
                        "starting_date": results[0].starting_date,
                        "ending_date": results[0].ending_date,
                        "location": results[0].location,
                        "coordinates": results[0].coordinates,
                        "primary_color": results[0].primary_color,
                        "secondary_color": results[0].secondary_color
                    }});
        }).catch(function (err) {
            errors.handle(err, res);
    })
}

module.exports = {
    show: show
};