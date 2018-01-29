'use strict'

const errors = require('../util/error_handling')
const helpers = require('../util/helpers')

function getSponsors(eventId, callback) {
  const query = global.datastore.createQuery('SponsorRank').hasAncestor(datastore.key(['Event', parseInt(eventId)]))
  var sponsorRankArray = []
  global.datastore.runQuery(query, (err, entities) => {
    entities.forEach((sponsorRank) => {
      sponsorRankArray.push(helpers.sponsorRankSerializer(sponsorRank));
      console.log(sponsorRank[global.datastore.KEY])
        global.datastore.runQuery(global.datastore.createQuery('Sponsor').filter('rankId', '=', global.datastore.key(['Event', parseInt(eventId), 'SponsorRank', parseInt(sponsorRank[global.datastore.KEY].id)])), (err, entitiesSponsor) => {
          console.log(entitiesSponsor)
        entitiesSponsor.forEach((sponsor) => {
            sponsorRankArray[sponsorRankArray.length-1]['sponsors'] = helpers.sponsorSerializer(sponsor)
              if (sponsorRankArray.length === entities.length) {
                callback(sponsorRankArray)
              }
            })
        })
    })
  })
}


function show(req, res) {
    res.json({'status': 'Implementation missing'});
}

module.exports = {
    getSponsors: getSponsors,
    show: show
};
