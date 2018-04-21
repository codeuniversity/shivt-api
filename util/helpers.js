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
  if(array.length > 0) {
    return array.sort(function (a, b) {
      let x = a[key]
      let y = b[key]
      return ((x < y) ? -1 : ((x > y) ? 1 : 0))
    })
  } else {
    return []
  }
}

function findInRelationalEntity(sourceKey, entityName, callback) {
  global.datastore.runQuery(global.datastore.createQuery(entityName).filter(sourceKey.kind.toLowerCase(), '=', sourceKey), (err, targetKeys) => {
    if(err) {
      console.log(err)
    }
    if(targetKeys.length !== 0) {
      let targetKey = Object.keys(targetKeys[0]);
      targetKey.splice(targetKey.indexOf(sourceKey.kind.toLowerCase()), 1)
      global.datastore.get(targetKeys.map(obj => obj[targetKey[0]]), (err, targetEntities) => {
        if (err)
          console.log(err)
        callback(targetEntities)
      })
    } else {
      callback([])
    }
  })

  }

  function insertRelation(isGlobal, entityType, firstKey, secondKey, res, callback) {

    const errors = require('../util/error_handling');

    global.datastore.runQuery(global.datastore.createQuery(entityType)
        .filter(firstKey.kind.toLowerCase(), firstKey)
        .filter(secondKey.kind.toLowerCase(), secondKey),
      (err, exists) => {
        if (exists !== undefined && exists.length !== 0) {
          errors.output('relation_already_exist', 'relation does already exist', res)
        } else {
          global.datastore.get(firstKey, (err, first) => {
            if (first === undefined) {
              errors.output(firstKey.kind.toLowerCase()+'_not_exist', firstKey.kind.toLowerCase()+' does not exist', res)
            } else {
              console.log(secondKey)
              global.datastore.get(secondKey, (err, second) => {
                if (second === undefined) {
                  errors.output(secondKey.kind.toLowerCase()+'_not_exist', secondKey.kind.toLowerCase()+' does not exist', res)
                } else {
                  entityData = {}
                  entityData[firstKey.kind.toLowerCase()] = firstKey
                  entityData[secondKey.kind.toLowerCase()] = secondKey
                  const entity = {
                    key: isGlobal ? global.datastore.key(entityType) : global.datastore.key(['Event', parseInt(firstKey.parent.id), entityType]),
                    data: entityData
                  }
                  global.datastore.insert(entity).then((results) => {
                    callback(true)
                  })
                }
              })
            }
          })
        }
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

function employeeSerializer (employee, skills) {
  return {
    'id': employee[global.datastore.KEY].id,
    'firstname': employee.firstname,
    'lastname': employee.lastname,
    'gender': employee.gender,
    'email': employee.email,
    'phone': employee.phone,
    'skills': skills,
    'inviteCode': employee.inviteCode,
  }
}

function shiftSerializer (shift, skills, contact) {
  return {
    'id': shift[global.datastore.KEY].id,
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
    'firstname': contact.firstname,
    'lastname': contact.lastname,
    'phone': contact.phone,
    'email': contact.email
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
  employeeSerializer: employeeSerializer,
  shiftSerializer: shiftSerializer,
  skillSerializer: skillSerializer,
  contactSerializer: contactSerializer,
  insertRelation: insertRelation
}
