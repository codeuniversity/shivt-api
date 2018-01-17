'use strict';
var express = require('express');
var app = express();
var port = process.env.PORT || 3000;
var bodyParser = require('body-parser');
var routes = require('./routes/index');

GLOBAL.datastore = require('@google-cloud/datastore')({
  projectId: 'conferencify-2018',
  keyFilename: 'keyfile.json'
});

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use("/api/v1", routes);

app.listen(port);

console.log('Shivt RESTful API server started on: ' + port);