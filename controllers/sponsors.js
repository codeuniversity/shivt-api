'use strict'

const errors = require('../util/error_handling')
const helpers = require('../util/helpers')

function getSponsors(eventId, callback) {
  const query = global.datastore.createQuery('SponsorRank').hasAncestor(datastore.key(['Event', parseInt(eventId)]))
  var sponsorRankArray = []
  global.datastore.runQuery(query, (err, entities) => {
    entities.forEach((sponsorRank) => {
      var sponsorRankTemp = helpers.sponsorRankSerializer(sponsorRank)
      sponsorRankTemp['sponsor'] = []
      global.datastore.runQuery(global.datastore.createQuery('Sponsor').filter('rank', '=', sponsorRank[global.datastore.KEY]), (err, entitiesSponsor) => {
        entitiesSponsor.forEach((sponsor, index) => {
          sponsorRankTemp['sponsor'].push(helpers.sponsorSerializer(sponsor))
          if(index === (entitiesSponsor.length-1)){
            sponsorRankArray.push(sponsorRankTemp)
            if (sponsorRankArray.length === entities.length) {
                callback(sponsorRankArray)
            }
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