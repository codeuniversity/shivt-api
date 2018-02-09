function normalizeDate (date) {
  date.setUTCHours(0)
  date.setUTCSeconds(0)
  date.setUTCMilliseconds(0)
  return date
}

function sortTalk (talks, talk) {
  let found = false
  for (let i = 0; i < talks.length; i++) {
    if (normalizeDate(new Date(talk.startingDate)).toISOString() === talks[i].date) {
      talks[i].talks.push(talk)
      found = true
      break
    }
  }
  if (!found) {
    talks.push({
      'date': normalizeDate(new Date(talk.startingDate)).toISOString(),
      'talks': [
        talk
      ]
    })
  }
}

function sortByKey (array, key) {
  return array.sort(function (a, b) {
    var x = a[key]
    var y = b[key]
    return ((x < y) ? -1 : ((x > y) ? 1 : 0))
  })
}

function talkSerializer (talk, speakers) {
  return {
    'id': talk[global.datastore.KEY].id,
    'name': talk.name,
    'description': talk.description,
    'type': talk.type,
    'startingDate': talk.startingDate,
    'endingDate': talk.endingDate,
    'location': talk.location,
    'speakers': speakers
  }
}

function speakerSerializer (speaker) {
  return {
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
  }
}

function sponsorRankSerializer (sponsorRank) {
  return {
    'id': sponsorRank[global.datastore.KEY].id,
    'name': sponsorRank.name,
    'order': sponsorRank.order
  }
}

function sponsorSerializer (sponsor) {
  return {
    'id': sponsor[global.datastore.KEY].id,
    'name': sponsor.name,
    'description': sponsor.description,
    'logo': sponsor.logo,
    'order': sponsor.order
  }
}

function userSerializer (user) {
  return {
    'id': user[0][global.datastore.KEY].id,
    'type': user[0].type
  }
}

module.exports = {
  normalizeDate: normalizeDate,
  sortTalk: sortTalk,
  sortByKey: sortByKey,
  talkSerializer: talkSerializer,
  speakerSerializer: speakerSerializer,
  sponsorRankSerializer: sponsorRankSerializer,
  sponsorSerializer: sponsorSerializer,
  userSerializer: userSerializer
}
