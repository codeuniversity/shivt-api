'use strict';

const errors = require('../util/error_handling');

function index (req, res) {

    // TODO: Return basic speaker data (e.g. name, company)

    const query = datastore.createQuery('Talk').hasAncestor(datastore.key(['Event', parseInt(req.params.eventId)]));
    GLOBAL.datastore.runQuery(query)
        .then((results) => {
            const talks = [];
            results[0].forEach(function (talk) {
                talks.push({
                    'name': talk.name,
                    'description': talk.description,
                    'startingDate': talk.startingDate,
                    'endingDate': talk.endingDate,
                    'location': talk.location
                });
            });
            res.json({"status": "OK", "talks":talks});
        }).catch(function (err) {
            errors.handle(err, res);
    })
}

module.exports = {
    index: index
};