"use strict"

const errors = require("../util/error_handling");

// TODO: Distinguish datasets between index and show

function index(req, res) {
    const query = global.datastore.createQuery('Attendee').order('lastname').filter('type', '=', 1).hasAncestor(datastore.key(['Event', parseInt(req.params.eventId)]))
    global.datastore.runQuery(query, (err, entities) => {
        if (err) {
            errors.handle(err, res)
        }
        let speakers = []
        entities.forEach(function (speaker) {
            console.log(speaker[global.datastore.KEY]);
            speakers.push({
                'id': speaker[global.datastore.KEY].id,
                'firstname': speaker.firstname,
                'lastname': speaker.lastname,
                'photo': speaker.photo,
                'company': speaker.company,
                'position': speaker.position,
                'description': speaker.description,
                'socialMedia': {
                    'linkedIn': speaker.linkedIn
                }
            })
            if (speakers.length === entities.length) {
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
        res.json({
            'id': speaker[global.datastore.KEY].id,
            'firstname': speaker.firstname,
            'lastname': speaker.lastname,
            'photo': speaker.photo,
            'company': speaker.company,
            'position': speaker.position,
            'description': speaker.description,
            'socialMedia': {
                'linkedIn': speaker.linkedIn
            }
        })
    })
}

module.exports = {
    index: index,
    show: show
};
