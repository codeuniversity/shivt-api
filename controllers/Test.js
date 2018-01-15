/* global datastore */
'use strict'
exports.thisIsATestFunction = function (req, res) {
  const query = datastore.createQuery('event').limit(1)
  datastore.runQuery(query)
    .then((results) => {
      res.json({message: results})
    })
}
