/* eslint no-undef: "off" */
var express = require('express')
var app = express()
var port = process.env.PORT || 3000
var bodyParser = require('body-parser')

datastore = require('@google-cloud/datastore')({
  projectId: 'conferencify-2018',
  keyFilename: 'keyfile.json'
})

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
var routes = require('./router/index')
routes(app)

app.listen(port)

console.log('todo list RESTful API server started on: ' + port)