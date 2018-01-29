'use strict'

const errors = require('../util/error_handling')
const helpers = require('../util/helpers')

function getSponsors(eventId, callback) {
  const query = global.datastore.createQuery('SponsorRank').hasAncestor(datastore.key(['Event', parseInt(eventId)]))
  var sponsorRankArray = []
  global.datastore.runQuery(query, (err, entities) => {
    entities.forEach((sponsorRank) => {
      sponsorRankArray.push(helpers.sponsorRankSerializer(sponsorRank));
        global.datastore.runQuery(global.datastore.createQuery('Sponsor').filter('rank', '=', sponsorRank[global.datastore.KEY]), (err, entitiesSponsor) => {
          entitiesSponsor.forEach((sponsor, index) => {
            console.log(index,entitiesSponsor.length-1)
            sponsorRankArray[sponsorRankArray.length-1]['sponsors'][index] = helpers.sponsorSerializer(sponsor)
            console.log(sponsorRankArray)
              if (sponsorRankArray.length === entities.length && index === (entitiesSponsor.length-1)) {
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