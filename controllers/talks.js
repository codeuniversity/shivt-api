'use strict';

const errors = require('../util/error_handling');
const helpers = require('../util/helpers');

function index(req, res) {
    const query = global.datastore.createQuery('Talk').order('startingDate').hasAncestor(datastore.key(['Event', parseInt(req.params.eventId)]));
    global.datastore.runQuery(query, (err, entities) => {
        if(err) {
            errors.handle(err, res);
        }
        let downloadedTalks = 0;
        const talks = [];
        let conferenceDay = [];
        entities.forEach((talk) => {
            if(conferenceDay.length === 0) {
                console.log(talk.startingDate);
                conferenceDay = {
                    'date': helpers.normalizeDate(new Date(talk.startingDate)).toISOString(),
                    'talks': []
                }
            }
            const speakers = [];
            global.datastore.runQuery(global.datastore.createQuery('_TalkSpeaker').filter('talk', '=', talk[global.datastore.KEY]), (err, speaker_ids) => {
                if(err) {
                    errors.handle(err, res);
                }

                // TODO: Use batch operation to retrieve multiple speakers at once

                speaker_ids.forEach((speaker_id) => {
                    global.datastore.get(speaker_id.speaker, function (err, speaker) {
                        if(err) {
                            errors.handle(err, res)
                        }
                        speakers.push({
                                'id': speaker[0][global.datastore.KEY].id,
                                'firstname': speaker[0].firstname,
                                'lastname': speaker[0].lastname,
                                'company': speaker[0].company,
                                'position': speaker[0].position,
                                'photo': speaker[0].photo,
                            });
                            if(speakers.length === speaker_ids.length) {
                                console.log(conferenceDay['talks'][conferenceDay['talks'].length-1]);
                                if(conferenceDay['talks'].length !== 0 && helpers.normalizeDate(new Date(talk.startingDate)).toISOString() !== helpers.normalizeDate(new Date(conferenceDay['talks'][conferenceDay['talks'].length-1].startingDate)).toISOString()) {
                                    talks.push(conferenceDay);
                                    conferenceDay = {
                                        'date': helpers.normalizeDate(new Date(talk.startingDate)).toISOString(),
                                        'talks': []
                                    }
                                }
                                    console.log("push...");
                                    conferenceDay['talks'].push({
                                        'name': talk.name,
                                        'description': talk.description,
                                        'type': talk.type,
                                        'startingDate': talk.startingDate,
                                        'endingDate': talk.endingDate,
                                        'location': talk.location,
                                        'speakers': speakers
                                    });
                                    downloadedTalks++;
                                if(downloadedTalks === entities.length) {
                                    talks.push(conferenceDay);
                                    res.json({'status': 'OK', 'talks': talks});
                                }
                            }
                        })
                    });
                });
            });
        });
    }

    // TODO: Add show function for retrieving single talk.

    module.exports = {
        index: index
    };