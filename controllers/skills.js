'use strict'

const helpers = require("../util/helpers")
const errors = require('../util/error_handling');

function index(req, res) {

  global.datastore.runQuery(global.datastore.createQuery('Skill').hasAncestor(datastore.key(['Event', parseInt(req.params.eventId)])), (err, tmp_skills) => {

    let skills = []

    tmp_skills.forEach((tmp_skill) => {
      skills.push(helpers.skillSerializer(tmp_skill))
    })

    res.json({'status': true, 'skills': helpers.sortByKey(skills, 'name')})

  })

}

function show(req, res) {

  global.datastore.get(global.datastore.key(['Event', parseInt(req.params.eventId), 'Skill', parseInt(req.params.skillId)]), (err, tmp_skill) => {
    if(tmp_skill === undefined) {
      errors.output('skill_not_exist', 'skill does not exist', res)
    } else {
        res.json({'status': true, 'skill': helpers.skillSerializer(tmp_skill)})
    }
  })

}

function create(req, res) {
  const entity = {
    key: global.datastore.key(['Event', parseInt(req.params.eventId), 'Skill']),
    data: {
      name: req.body.name,
    }
  }
  global.datastore.insert(entity).then((results) => {
    res.json({'status': true, 'id': results[0].mutationResults[0].key.path[1].id})
  })
}

function update(req, res) {
      const entity = {
        key: global.datastore.key(['Event', parseInt(req.params.eventId), 'Skill', parseInt(req.params.skillId)]),
        data: {
          name: req.body.name,
        }
      }
      global.datastore.update(entity, (err) => {
        if(err) {
          if(err.code === 5) {
            errors.output('skill_not_exist', 'skill does not exist', res)
          }
        }
        res.json({'status': true})
      })
}

function remove(req, res) {
  global.datastore.delete(global.datastore.key(['Event', parseInt(req.params.eventId), 'Skill', parseInt(req.params.skillId)]), () => {
    res.json({'status': true})
  });
}

module.exports = {
  index: index,
  show: show,
  create: create,
  update: update,
  remove: remove
}
