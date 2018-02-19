function normalizeDate (date) {
  date.setUTCHours(0)
  date.setUTCSeconds(0)
  date.setUTCMilliseconds(0)
  return date
}

function sortByDay (talks, talk, key_name) {
  let found = false
  for (let i = 0; i < talks.length; i++) {
    if (normalizeDate(new Date(talk.startingDate)).toISOString() === talks[i].date) {
      talks[i][key_name].push(talk)
      found = true
      break
    }
  }
  if (!found) {
    let object = {}
    object['date'] = normalizeDate(new Date(talk.startingDate)).toISOString()
    object[key_name] = [talk]
    talks.push(object)
  }
}

function sortByKey (array, key) {
  return array.sort(function (a, b) {
    let x = a[key]
    let y = b[key]
    return ((x < y) ? -1 : ((x > y) ? 1 : 0))
  })
}

function findInRelationalEntity(sourceKey, entityName, callback) {
  global.datastore.runQuery(global.datastore.createQuery(entityName).filter(sourceKey.kind.toLowerCase(), '=', sourceKey), (err, targetKeys) => {
    if(err) {
      console.log(err)
    }
    let targetKey = Object.keys(targetKeys[0]);
    targetKey.splice(targetKey.indexOf(sourceKey.kind.toLowerCase()), 1)
    global.datastore.get(targetKeys.map(obj => obj[targetKey[0]]), (err, targetEntities) => {
      if(err)
        console.log(err)
      callback(targetEntities)
    })
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

function shiftSerializer (shift, skills, contact) {
  return {
    'name': shift.name,
    'description': shift.description,
    'startingDate': shift.startingDate,
    'endingDate': shift.endingDate,
    'requiredSkills': skills,
    'preferredGender': shift.preferredGender,
    'meetingPoint': shift.meetingPoint,
    'contact': contact
  }
}

function skillSerializer (skill) {
  return {
    'id': skill[global.datastore.KEY].id,
    'name': skill.name
  }
}

function contactSerializer (contact) {
  return {
    'id': contact[global.datastore.KEY].id,
    'name': contact.name,
    'phone': contact.phone,
    'mail': contact.mail
  }
}

module.exports = {
  sortByDay: sortByDay,
  sortByKey: sortByKey,
  findInRelationalEntity: findInRelationalEntity,
  talkSerializer: talkSerializer,
  speakerSerializer: speakerSerializer,
  sponsorRankSerializer: sponsorRankSerializer,
  sponsorSerializer: sponsorSerializer,
  userSerializer: userSerializer,
  shiftSerializer: shiftSerializer,
  skillSerializer: skillSerializer,
  contactSerializer: contactSerializer
}
