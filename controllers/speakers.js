"use strict"

const errors = require("../util/error_handling")
const helpers = require("../util/helpers")

function index(req, res) {
    const query = global.datastore.createQuery('Attendee').filter('type', '=', 1).hasAncestor(datastore.key(['Event', parseInt(req.params.eventId)]))
    global.datastore.runQuery(query, (err, entities) => {
        if (err) {
            errors.handle(err, res)
        }
        let speakers = []
        entities.forEach(function (speaker) {
            console.log(speaker[global.datastore.KEY]);
            speakers.push(helpers.speakerSerializer(speaker))
            if (speakers.length === entities.length) {
                helpers.sortByKey(speakers,'lastname')
                res.json({'status': 'OK', 'speakers': speakers})
            }
        })
    })
}


function show(req, res) {

    // IMPORTANT: In case the requested ID has an ancestor, datastore.key takes four parameters.

    const speakerKey = global.datastore.key(['Event', parseInt(req.params.eventId), 'Attendee', parseInt(req.params.speakerId)])
    global.datastore.get(speakerKey, function (err, speaker) {
        if(err) {
            errors.handle(err, res)
        }
        res.json({'status': 'OK', 'speaker': helpers.speakerSerializer(speaker)})
    })
}

module.exports = {
    index: index,
    show: show
};
