'use strict';

function show (req, res) {
    GLOBAL.datastore.get(GLOBAL.datastore.key(['event', parseInt(req.params.eventId)]))
        .then((results) => {
            res.json({message: results})
        }).catch(err => {
        console.error('ERROR:', err);
    });
}

module.exports = {
    show: show
};