'use strict';

const errors = require('../util/error_handling');
const helpers = require('../util/helpers');

function show(req, res) {

    // IMPORTANT: In case the requested ID has an ancestor, datastore.key takes four parameters.

    const talkKey = global.datastore.key(['Event', parseInt(req.params.eventId), 'Talk', parseInt(req.params.talkId)])
    global.datastore.get(talkKey, function (err, talk) {
        if(err) {
            errors.handle(err, res)
        }
        const speakers = [];
        global.datastore.runQuery(global.datastore.createQuery('_TalkSpeaker').filter('talk', '=', talk[global.datastore.KEY]), (err, result_keys) => {
            if(err) {
                errors.handle(err, res);
            }
            result_keys.forEach((result_key) => {
                speakers.push(result_key.speaker.id);
                if(speakers.length === result_keys.length) {
                        res.json({'status': 'OK', 'talk': helpers.talkSerializer(talk, speakers)})
                    }
                });
            });
        });
    }

    function getTalks(eventId, callback) {
        const query = global.datastore.createQuery('Talk').hasAncestor(datastore.key(['Event', parseInt(eventId)]));
        global.datastore.runQuery(query, (err, entities) => {
            if(err) {
                errors.handle(err, entities);
            }
            let downloadedTalks = 0;
            const talks = [];
            entities.forEach((talk) => {
                const speakers = [];
                global.datastore.runQuery(global.datastore.createQuery('_TalkSpeaker').filter('talk', '=', talk[global.datastore.KEY]), (err, result_keys) => {
                    result_keys.forEach((result_key) => {
                        speakers.push(result_key.speaker.id);
                        if(speakers.length === result_keys.length) {
                            helpers.sortTalk(talks, helpers.talkSerializer(talk, speakers))
                            downloadedTalks++;
                            if(downloadedTalks === entities.length) {
                                talks.forEach(function (day) {
                                    helpers.sortByKey(day.talks, 'startingDate');
                                })
                                helpers.sortByKey(talks, 'date');
                                callback(talks);
                            }
                        }
                    });
                });
            });
        });
    }

    module.exports = {
        show: show,
        getTalks: getTalks
    };